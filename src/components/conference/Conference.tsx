import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { EventTypes } from '@southworks/custom-shared-object-client';
import Chat from './chat/Chat';
import Constants from '../../assets/utils/Constants';
import QuickActions from './quickActions/QuickActions';
import LiveFeedContainer from './liveFeed/LiveFeedContainer';
import Timer from './timer/Timer';
import '../../assets/css/ConferenceStyles.scss';
import { useShowNotification } from '../../context/ShowNotificationContext';
import Red5ProContext from '../../context/Red5ProServiceContext';

const Conference: FC = () => {
  const { setObjectNotification } = useShowNotification();
  const { red5ProService } = Red5ProContext.useRed5Pro();
  const { conferenceId } = useParams<{ conferenceId: string }>();
  const currentStream = red5ProService.getCurrentStream();
  const [participantsList, setParticipantsList] = useState({});
  const [streamsList, setStreamsList] = useState(red5ProService.getStreamersList());
  const [ownResources, setOwnResources] = useState(currentStream ? [{ id: Constants.PUBLISHER, mediaStream: currentStream }] : []);

  const shareScreenCallback = async (isSharing: boolean) => {
    if (isSharing) {
      await red5ProService.stopScreenSharing();
      const updatedResources = ownResources.filter((resource) => resource.id !== Constants.SCREEN_SHARE_PUBLISHER);
      setOwnResources([...updatedResources]);
    } else {
      try {
        const screenShareMediaStream = await red5ProService.startScreenSharing();
        const screenShareStream = {
          id: Constants.SCREEN_SHARE_PUBLISHER,
          mediaStream: screenShareMediaStream,
        };
        setOwnResources([screenShareStream, ...ownResources]);
      } catch (e) {
        if (e.name !== 'NotAllowedError') {
          setObjectNotification({ show: true, message: Constants.SCREEN_SHARE_ERROR, type: Constants.ERROR });
        }
        throw e;
      }
    }
  };

  useEffect(() => {
    const updateParticipantsList = () => {
      setParticipantsList({ ...red5ProService.getParticipantsList() });
      setStreamsList(red5ProService.getStreamersList());
    };

    if (red5ProService?.conferenceConnection?.sharedObject) {
      red5ProService.conferenceConnection.setEventCallbacks([
        {
          type: EventTypes.PROPERTY_UPDATE,
          callback: updateParticipantsList,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [red5ProService.conferenceConnection.sharedObject]);

  useEffect(() => {
    return () => {
      red5ProService.leaveConference();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const liveFeedOverrideStyles = {
    height: 'calc(100vh - 180px)',
  };

  return (
    <Container fluid className="mw-960 conference">
      <Col xs={12}>
        <Row className="conference-header">
          <Col xs={5}>
            <div className="title">{conferenceId}</div>
          </Col>
          <Col xs={2}>
            <Timer roomName={conferenceId} />
          </Col>
          <Col xs={5} />
        </Row>
        <Row className="conference-container">
          <Col xs={1}>
            <QuickActions participantsList={participantsList} shareScreenCallback={shareScreenCallback} red5ProService={red5ProService} />
          </Col>
          <Col xs={8}>
            <LiveFeedContainer videoSource={ownResources} streamList={streamsList} showHeader liveFeedOverrideStyles={liveFeedOverrideStyles} />
          </Col>
          <Col xs={3}>
            <Chat streamName={conferenceId} nickName={conferenceId} showHeader height="calc(100% - 30px)" />
          </Col>
        </Row>
      </Col>
    </Container>
  );
};

export default Conference;
