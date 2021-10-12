import React, { FC, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Container, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { getVideoDevices, mediaDevicesAreAllowed, getAudioInputDevices } from '../../services/GeneralService';
import Chat from '../conference/chat/Chat';
import ConsumerActions from './ConsumerActions';
import Timer from '../conference/timer/Timer';
import '../../assets/css/consumer-app/ConsumerConference.scss';
import { IOwnResource, IDevices, IRenditions, IDeviceConfiguration, IStream } from '../../assets/utils/Interfaces';
import Constants from '../../assets/utils/Constants';
import { useShowNotification } from '../../context/ShowNotificationContext';
import { useChannel } from '../../context/ChannelContext';
import ParticipantInvitation from '../conference/participants/ParticipantInvitation';
import ParticipantDeviceSettings from './ParticipantDeviceSettings';
import { useLoader } from '../../context/LoaderContext';
import LiveFeedData from './LiveFeedData';
import LiveFeedContainer from '../conference/liveFeed/LiveFeedContainer';
import NumberOfViewers from './NumberOfViewers';
import NicknameModal from './NicknameModal';
import ChannelService from '../../services/ChannelService';
import Red5ProContext from '../../context/Red5ProServiceContext';

const channelService = new ChannelService();

const ConsumerConference: FC = () => {
  const { red5ProService } = Red5ProContext.useRed5Pro();
  const { conferenceId } = useParams<{ conferenceId: string }>();
  const { setObjectNotification } = useShowNotification();
  const { selectedChannel, setSelectedChannel } = useChannel();
  const { setIsLoading } = useLoader();
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showCoStreamingDeviceSettings, setShowCoStreamingDeviceSettings] = useState(false);
  const [participantsList, setParticipantsList] = useState({});
  const [isCoStreamer, setIsCoStreamer] = useState(false);
  const [streamsList, setStreamsList] = useState<Array<IStream>>([]);
  const [ownResources, setOwnResources] = useState<IOwnResource[]>([]);
  const [nickName, setNickName] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showNicknameModal] = useState(true);
  const [videoDevices, setVideoDevices] = useState<IDevices[]>([]);
  const [audioInputDevices, setAudioInputDevices] = useState<IDevices[]>([]);
  const [renditions, setRenditions] = useState<IRenditions[]>([]);
  const [currentDeviceConfiguration, setCurrentDeviceConfiguration] = useState<IDeviceConfiguration>({} as IDeviceConfiguration);
  const [isPerformingOperation, setIsPerformingOperation] = useState(false);
  const [selectedNickname, setSelectedNickname] = useState(false);
  const [channelCustomStyles, setChannelCustomStyles] = useState('');

  const initWithDevices = async () => {
    if (isPerformingOperation) return;
    setIsPerformingOperation(true);
    const videoConstraints = {
      deviceId: {
        exact: currentDeviceConfiguration.video.deviceId,
      },
      width: {
        exact: currentDeviceConfiguration.video.w,
      },
      height: {
        exact: currentDeviceConfiguration.video.h,
      },
    };
    const mediaConfig = {
      mediaConstraints: {
        audio: true,
        video: videoConstraints,
      },
    };
    try {
      await red5ProService.initPublisher(mediaConfig);
      setIsPerformingOperation(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentDeviceConfiguration?.video?.deviceId === undefined) return;
    initWithDevices();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [currentDeviceConfiguration]);

  const getChannel = async () => {
    setIsLoading(true);
    try {
      const { data } = await channelService.getChannelById(conferenceId);
      setSelectedChannel(data);
      setChannelCustomStyles(data.customStyles);
    } catch (err) {
      setObjectNotification({ show: true, message: Constants.GET_CHANNEL_ERROR, type: Constants.ERROR });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stylesheetElement = document.createElement('style');
    stylesheetElement.innerText = channelCustomStyles;
    stylesheetElement.classList.add('custom-channel-stylesheet');
    document.head.appendChild(stylesheetElement);

    return () => {
      const currentStylesheet = document.head.querySelector('.custom-channel-stylesheet');
      currentStylesheet?.parentElement?.removeChild(currentStylesheet);
    };
  }, [channelCustomStyles]);

  const getVideoInputCapabilities = async (id: string) => {
    const availableRenditions: IRenditions[] = [];
    let maxHeight = Constants.UHDV.h;
    let maxWidth = Constants.UHDV.w;
    const videoInputDevices = await getVideoDevices();
    const selectedCamera = videoInputDevices.find((device: { deviceId: string }) => device.deviceId === id);
    try {
      const capabilities = (selectedCamera as InputDeviceInfo).getCapabilities();
      maxHeight = capabilities?.height?.max || Constants.UHDV.h;
      maxWidth = capabilities?.width?.max || Constants.UHDV.w;
    } catch (e) {
      console.log('no browser support for getCapabilities()');
    }
    Constants.RENDITIONS.forEach((rendition: any) => {
      availableRenditions.push({
        value: rendition.label,
        disabled: rendition.h > maxHeight || rendition.w > maxWidth,
        w: rendition.w,
        h: rendition.h,
      });
    });
    return availableRenditions;
  };

  const setUpInitialDevices = async () => {
    const audioInputDevicesList = await getAudioInputDevices();
    const mappedAudioDevices = audioInputDevicesList.map((audioInput: any) => {
      return { id: audioInput.deviceId, name: audioInput.label };
    });

    const videoInputDevices = await getVideoDevices();
    const mappedVideoDevices = videoInputDevices.map((videoInput: any) => {
      return { id: videoInput.deviceId, name: videoInput.label };
    });

    const cameraCapabilities = await getVideoInputCapabilities(mappedVideoDevices[0]?.id);
    const QVGA = { w: Constants.QVGA.w, h: Constants.QVGA.h };
    const topRendition = [...cameraCapabilities].reverse().find((rendition) => rendition.disabled === false) || QVGA;
    setRenditions(cameraCapabilities);
    setVideoDevices(mappedVideoDevices);
    setAudioInputDevices(mappedAudioDevices);

    setCurrentDeviceConfiguration({
      video: {
        deviceId: mappedVideoDevices[0]?.id,
        w: topRendition.w,
        h: topRendition.h,
      },
      audio: {
        deviceId: mappedAudioDevices[0]?.id,
        label: mappedAudioDevices[0]?.name,
      },
    });
  };

  const initWebRtc = async () => {
    try {
      const {
        data: { jwt },
      } = await channelService.generateCredentials(conferenceId, Constants.PUBLISHER, nickName);
      red5ProService.setAuthParams(jwt);
      if (selectedChannel.hasAbr) {
        await red5ProService.setTranscoderEndpoint();
      } else {
        await red5ProService.setOriginEndpoint();
      }
      setObjectNotification({ show: true, message: Constants.ORIGIN_REQUEST_SUCCESS, type: Constants.SUCCESS });
    } catch (err) {
      console.log(err);
      setObjectNotification({ show: true, message: Constants.ORIGIN_REQUEST_ERROR, type: Constants.ERROR });
    } finally {
      if (await mediaDevicesAreAllowed()) {
        setUpInitialDevices();
      } else {
        setObjectNotification({ show: true, message: Constants.MEDIA_DEVICES_NOT_AVAILABLE, type: Constants.ERROR });
      }
    }
  };

  const onVideoDeviceSelected = async (deviceId: string) => {
    const cameraCapabilities = await getVideoInputCapabilities(deviceId);
    setRenditions(cameraCapabilities);
    setCurrentDeviceConfiguration({
      ...currentDeviceConfiguration,
      video: {
        deviceId,
        w: currentDeviceConfiguration.video.w,
        h: currentDeviceConfiguration.video.h,
      },
    });
  };

  const onAudioDeviceSelected = async (deviceId: string) => {
    setCurrentDeviceConfiguration({
      ...currentDeviceConfiguration,
      audio: {
        deviceId,
        label: currentDeviceConfiguration.audio.label,
      },
    });
  };

  const onCapabilitiesSelected = (capability: string) => {
    const selectedCapabilities = capability.split('x');
    setCurrentDeviceConfiguration({
      ...currentDeviceConfiguration,
      video: {
        deviceId: currentDeviceConfiguration.video.deviceId,
        w: parseInt(selectedCapabilities[0], 10),
        h: parseInt(selectedCapabilities[1], 10),
      },
    });
  };

  const getOwnResource = useCallback(() => {
    const mediaStream = red5ProService.getCurrentStream();
    return mediaStream ? [{ id: Constants.PUBLISHER, mediaStream }] : [];
  }, [red5ProService]);

  const updateStreams = useCallback(() => {
    setStreamsList(red5ProService.getStreamersList());
    setOwnResources(getOwnResource());
  }, [getOwnResource, red5ProService]);

  const stopCoStreaming = useCallback(async () => {
    setIsLoading(true);
    try {
      await red5ProService.stopCoStreaming();
      setOwnResources([]);
      setIsCoStreamer(false);
      setObjectNotification({ show: true, message: Constants.STOP_CO_STREAMING, type: Constants.SUCCESS });
    } catch {
      setObjectNotification({ show: true, message: Constants.STOPPING_CO_STREAMING_ERROR, type: Constants.ERROR });
    }
    setIsLoading(false);
  }, [red5ProService, setIsLoading, setObjectNotification]);

  const onConnectionSuccess = useCallback(() => {
    setIsLoading(false);
    const displayInvitationCallback = (event: any) => {
      const { lastInvitationDate } = event.data.message;
      if (typeof lastInvitationDate === 'string' && lastInvitationDate[0] === '0') {
        setShowInvitationModal(false);
        setShowCoStreamingDeviceSettings(false);
      } else {
        setShowInvitationModal(true);
      }
    };
    red5ProService.addHousekeeperMethodUpdateCallback(red5ProService.streamName, displayInvitationCallback);
    red5ProService.addHousekeeperMethodUpdateCallback(Constants.STOP_SIGNAL_METHOD_NAME(red5ProService.streamName), stopCoStreaming);
  }, [red5ProService, stopCoStreaming, setIsLoading]);

  const onConnectionFailure = useCallback(() => {
    setIsLoading(false);
    setObjectNotification({ show: true, message: Constants.UNABLE_TO_ACCESS, type: Constants.ERROR });
  }, [setIsLoading, setObjectNotification]);

  const updateParticipantsList = useCallback(() => {
    setParticipantsList({ ...red5ProService.getParticipantsList() });
    updateStreams();
  }, [red5ProService, updateStreams]);

  useEffect(() => {
    if (!selectedNickname) {
      return;
    }
    setIsLoading(true);
    red5ProService.addConnectionSuccessCallback(onConnectionSuccess);
    red5ProService.addConnectionFailureCallback(onConnectionFailure);
    red5ProService.addPropertyUpdateCallback(updateParticipantsList);
    red5ProService.accessConference(conferenceId, Constants.PARTICIPANT_ROLES.VIEWERS, nickName);
    // eslint-disable-next-line consistent-return
    return () => {
      red5ProService.leaveConference();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNickname]);

  const closeInvitationModal = () => {
    red5ProService.conferenceConnection.invokeMethodUpdate(red5ProService.conferenceConnection.roomName, {
      lastRejectionDate: Date.now(),
    });
    setShowInvitationModal(false);
  };

  const callbackCoStreaming = () => {
    setObjectNotification({ show: true, message: Constants.STARTING_CO_STREAMING, type: Constants.SUCCESS });
    red5ProService.conferenceConnection.joinAs({ ...red5ProService.participant, status: Constants.PARTICIPANT_ROLES.STREAMERS });
    setIsCoStreamer(true);
    setIsLoading(false);
    setShowCoStreamingDeviceSettings(false);
  };

  const openCoStreamingDeviceSettings = async () => {
    await initWebRtc();
    setShowInvitationModal(false);
    setShowCoStreamingDeviceSettings(true);
  };

  const closeCoStreamingDeviceSettings = () => {
    setShowCoStreamingDeviceSettings(false);
    setShowInvitationModal(true);
  };

  const startCostreaming = async () => {
    setIsLoading(true);
    try {
      await red5ProService.startCoStreaming(callbackCoStreaming);
    } catch {
      setObjectNotification({ show: true, message: Constants.STARTING_CO_STREAMING_ERROR, type: Constants.ERROR });
      setIsLoading(false);
    }
  };

  const toggleRightPanel = () => {
    setShowChat(!showChat);
  };

  const updateAskedToJoinStatus = async (askedToJoin: boolean) => {
    const { participant, conferenceConnection } = red5ProService;
    if (askedToJoin) {
      participant.askToJoin();
    } else {
      participant.dismissRequestToJoin();
    }
    await conferenceConnection.updateParticipantAdditionalData(participant.additionalData);
  };

  const liveFeedOverrideStyles = {
    height: '100%',
    border: '0',
  };

  const nickNameSelected = () => {
    setSelectedNickname(true);
  };

  const restoreDefaultValues = () => {
    red5ProService.setStreamName();
    setNickName(red5ProService.streamName);
    setSelectedNickname(true);
  };

  const participantsListArray = Object.keys(participantsList);

  return (
    <>
      {selectedNickname ? (
        <Container fluid className="mw-960 main-container">
          <Row className="h-100">
            <OverlayTrigger
              rootClose
              placement="left"
              overlay={<Tooltip id="popover">{showChat ? Constants.CHAT_TOOLTIP_MESSAGE.COLLAPSE : Constants.CHAT_TOOLTIP_MESSAGE.EXPAND}</Tooltip>}
            >
              <Button variant="" className={`floating-button ${showChat && 'opened'}`} onClick={toggleRightPanel}>
                {showChat ? <FaArrowRight /> : <FaArrowLeft />}
              </Button>
            </OverlayTrigger>
            <Col xs={showChat ? 9 : 12} className="center-panel-col h-100">
              <Row className="center-panel">
                <Col xs={12} className="h-100">
                  <LiveFeedContainer
                    videoSource={ownResources}
                    streamList={streamsList}
                    showHeader={false}
                    liveFeedOverrideStyles={liveFeedOverrideStyles}
                  />
                </Col>
              </Row>
              <Row className="information">
                <Col xs={12} className="d-flex align-items-center">
                  <Col xs={3} className="feed-data">
                    <LiveFeedData />
                  </Col>
                  <Col xs={6} className="d-flex justify-content-center">
                    <ConsumerActions
                      isCoStreamer={isCoStreamer}
                      stopCoStreaming={stopCoStreaming}
                      updateAskedToJoinStatus={updateAskedToJoinStatus}
                    />
                  </Col>
                  <Col xs={3} className="session-data">
                    <div className="d-flex justify-content-end align-items-center">
                      <NumberOfViewers participantsList={participantsListArray} />
                      <Timer roomName={conferenceId} />
                    </div>
                    <div className="participant-name">{nickName}</div>
                  </Col>
                </Col>
              </Row>
            </Col>
            <Col
              xs={3}
              className="right-panel"
              style={{
                display: showChat ? 'block' : 'none',
              }}
            >
              <Chat streamName={conferenceId} nickName={nickName} showHeader height="calc(100% - 50px)" headerClassName="consumer-header" />
            </Col>
          </Row>
          <ParticipantInvitation showModal={showInvitationModal} onConfirm={openCoStreamingDeviceSettings} onCancel={closeInvitationModal} />
          <ParticipantDeviceSettings
            showModal={showCoStreamingDeviceSettings}
            onConfirm={startCostreaming}
            onCancel={closeCoStreamingDeviceSettings}
            onVideoDeviceSelected={onVideoDeviceSelected}
            onAudioDeviceSelected={onAudioDeviceSelected}
            onCapabilitiesSelected={onCapabilitiesSelected}
            currentDeviceConfiguration={currentDeviceConfiguration}
            isPerformingOperation={isPerformingOperation}
            videoDevices={videoDevices}
            audioInputDevices={audioInputDevices}
            renditions={renditions}
          />
        </Container>
      ) : (
        <NicknameModal showModal={showNicknameModal} onConfirm={nickNameSelected} onCancel={restoreDefaultValues} setNickName={setNickName} />
      )}
    </>
  );
};

export default ConsumerConference;
