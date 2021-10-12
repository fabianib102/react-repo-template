import React, { useState, useEffect, FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { getVideoDevices, mediaDevicesAreAllowed } from '../services/GeneralService';
import Constants from '../assets/utils/Constants';
import { Channel } from '../models/Channel';
import '../assets/css/ChannelWebRTCStyles.scss';
import { useLoader } from '../context/LoaderContext';
import { IDeviceConfiguration, IDevices, IRenditions, IRed5ProService } from '../assets/utils/Interfaces';
import ChannelService from '../services/ChannelService';

const channelService = new ChannelService();

interface Props {
  streamId: string | undefined;
  onPublishing: any;
  onPublishedSuccess: any;
  onPublishedFailed: any;
  onUnpublishedSuccess: any;
  shownotification?: any;
  channel?: Channel;
  red5ProService: IRed5ProService;
  setIsLoadingResources: any;
}

const ChannelWebRTC: FC<Props> = (props: Props) => {
  const [published, setPublished] = useState(false);
  const [isInitializingConference, setIsInitializingConference] = useState(false);
  const [isPerformingOperation, setIsPerformingOperation] = useState(false);
  const [videoDevices, setVideoDevices] = useState<IDevices[]>([]);
  const [renditions, setRenditions] = useState<IRenditions[]>([]);
  const [currentDeviceConfiguration, setCurrentDeviceConfiguration] = useState<IDeviceConfiguration>({} as IDeviceConfiguration);
  const history = useHistory();
  const { setIsLoading } = useLoader();

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
      await props.red5ProService.initPublisher(mediaConfig);
      setIsPerformingOperation(false);
    } catch (err: any) {
      console.log(err);
    } finally {
      props.setIsLoadingResources(false);
    }
  };

  const publishCallback = () => {
    props.red5ProService.conferenceConnection.joinAs({ ...props.red5ProService.participant, status: Constants.PARTICIPANT_ROLES.STREAMERS });
    setIsLoading(false);
    history.push(`/${Constants.SPEAKER_PATH}/${props.streamId}`);
  };

  const publish = async () => {
    setIsLoading(true);
    props.onPublishing();
    setIsPerformingOperation(true);
    try {
      props.red5ProService.addPublisherEventCallback(props.red5ProService.publisherEvents.PUBLISH_START, publishCallback);
      await props.red5ProService.publish();
      setPublished(true);
      props.onPublishedSuccess();
    } catch (err: any) {
      console.log(err);
      props.shownotification(Constants.ERROR, Constants.PUBLISHING_ERROR, Constants.WEBRTC_PROTOCOL);
      props.onPublishedFailed();
    } finally {
      setIsPerformingOperation(false);
    }
  };

  const setUpInitialVideoAndRendition = async () => {
    const videoInputDevices = await getVideoDevices();
    const mappedDevices = videoInputDevices.map((videoInput: any) => {
      return { id: videoInput.deviceId, name: videoInput.label };
    });

    const cameraCapabilities = await getInputCapabilities(mappedDevices[0]?.id);
    const QVGA = { w: Constants.QVGA.w, h: Constants.QVGA.h };
    const topRendition = [...cameraCapabilities].reverse().find((rendition) => rendition.disabled === false) || QVGA;
    setRenditions(cameraCapabilities);
    setVideoDevices(mappedDevices);

    setCurrentDeviceConfiguration({
      ...currentDeviceConfiguration,
      video: {
        deviceId: mappedDevices[0]?.id,
        w: topRendition.w,
        h: topRendition.h,
      },
    });
  };

  const onDeviceSelected = async (deviceId: string) => {
    const cameraCapabilities = await getInputCapabilities(deviceId);
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

  const getInputCapabilities = async (id: string) => {
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

  const channelInfoLoaded = () => props.channel?.id === props.streamId;

  useEffect(() => {
    if (!channelInfoLoaded()) {
      return;
    }

    props.setIsLoadingResources(true);
    const initWebRtc = async () => {
      try {
        const {
          data: { jwt },
        } = await channelService.generateCredentials(props.channel?.id as string, Constants.PUBLISHER);
        props.red5ProService.setAuthParams(jwt);
        props.red5ProService.setStreamName(props?.streamId);
        if (props.channel?.hasAbr) {
          await props.red5ProService.setTranscoderEndpoint();
        }
        await props.red5ProService.setOriginEndpoint();
        if (!isInitializingConference) {
          setIsInitializingConference(true);
          await props.red5ProService.initConference(props.channel?.id);
          setIsInitializingConference(false);
        }
        props.shownotification(Constants.SUCCESS, Constants.ORIGIN_REQUEST_SUCCESS, Constants.WEBRTC_PROTOCOL);
      } catch (err) {
        console.log(err);
        props.shownotification(Constants.ERROR, Constants.ORIGIN_REQUEST_ERROR, Constants.WEBRTC_PROTOCOL);
      } finally {
        if (await mediaDevicesAreAllowed()) {
          setUpInitialVideoAndRendition();
        } else {
          props.shownotification(Constants.ERROR, Constants.MEDIA_DEVICES_NOT_AVAILABLE, Constants.MEDIA_DEVICES);
          props.setIsLoadingResources(false);
        }
      }
    };
    initWebRtc();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [props.channel]);

  useEffect(() => {
    if (currentDeviceConfiguration?.video?.deviceId === undefined) return;
    initWithDevices();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [currentDeviceConfiguration]);

  return (
    <Row>
      <Col xs={8}>
        <video id="red5pro-publisher" className="red5pro-publisher" autoPlay playsInline muted style={{ width: '100%' }} />
      </Col>
      <Col xs={4} className="mt-2">
        <Form.Group controlId="camera-selector">
          <Form.Label>Select Device</Form.Label>
          <Form.Control
            as="select"
            value={currentDeviceConfiguration?.video?.deviceId}
            onChange={(e: { target: { value: string } }) => {
              onDeviceSelected(e.target.value);
            }}
            disabled={isPerformingOperation || published}
          >
            {videoDevices.map((device) => (
              <option key={`${device.id}-${device.name}`} value={device.id}>
                {device.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="rendition-selector">
          <Form.Label>Select Rendition</Form.Label>
          <Form.Control
            as="select"
            value={`${currentDeviceConfiguration?.video?.w}x${currentDeviceConfiguration?.video?.h}`}
            onChange={(e: { target: { value: string } }) => {
              onCapabilitiesSelected(e.target.value);
            }}
            disabled={isPerformingOperation || published}
          >
            {renditions.map((rendition) => (
              <option key={rendition.value} value={`${rendition.w}x${rendition.h}`} disabled={rendition.disabled}>
                {rendition.value}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="conference-group-button">
          <Button id="startButton" block onClick={publish} disabled={isPerformingOperation} className="button-primary">
            {`START ${Constants.CHANNEL_LABEL.toUpperCase()}`}
          </Button>
        </Form.Group>
      </Col>
    </Row>
  );
};

ChannelWebRTC.defaultProps = {
  shownotification: () => {},
  channel: {
    id: 'No selected stream key',
    channelName: `No ${Constants.CHANNEL_LABEL.toLowerCase()} selected`,
    hasAbr: false,
    createdOn: Date.now(),
    streamId: 'No selected stream key',
    channelStatus: 'string',
    ingestUrl: 'No endpoint selected',
    protocol: 'string',
  },
};

export default ChannelWebRTC;
