import React, { FC, useState, useEffect, useCallback } from 'react';
import { ListGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faPlusCircle, faStopCircle, faTimesCircle, faHandPaper } from '@fortawesome/free-solid-svg-icons';
import '../../../assets/css/ParticipantsList.scss';
import { useShowNotification } from '../../../context/ShowNotificationContext';
import Constants from '../../../assets/utils/Constants';
import { IParticipantSharedObjectData, IRed5ProService } from '../../../assets/utils/Interfaces';

interface Props {
  participants: Record<string, IParticipantSharedObjectData>;
  showList: boolean;
  red5ProService: IRed5ProService;
}

const ParticipantsList: FC<Props> = (props: Props) => {
  const { participants, red5ProService } = props;
  const participantsKeys = Object.keys(participants);
  const { setObjectNotification } = useShowNotification();
  const [costreamerExists, setCoStreamerExists] = useState(false);
  const [pendingInvitation, setPendingInvitation] = useState<string | boolean>(false);

  const sendInvitation = (userName: string) => {
    setPendingInvitation(userName);
    red5ProService.conferenceConnection.invokeMethodUpdate(userName, { lastInvitationDate: Date.now() });
    setObjectNotification({ show: true, message: 'Invitation sent', type: Constants.SUCCESS });
  };

  const cancelInvitation = (userName: string) => {
    setPendingInvitation(false);
    red5ProService.conferenceConnection.invokeMethodUpdate(userName, { lastInvitationDate: `0${Date.now()}` });
  };

  const stopCoStreamerStream = (userName: string) => {
    red5ProService.conferenceConnection.invokeMethodUpdate(`${Constants.STOP_SIGNAL_METHOD_NAME(userName)}`, { username: userName });
    setObjectNotification({ show: true, message: 'Stop signal sent', type: Constants.SUCCESS });
  };

  useEffect(() => {
    participantsKeys.forEach((participantKey: string) => {
      if (participants[participantKey].status === Constants.PARTICIPANT_ROLES.STREAMERS) {
        setCoStreamerExists(true);
        setPendingInvitation(false);
      }
    });

    return () => {
      setCoStreamerExists(false);
    };
  }, [participants, participantsKeys]);

  const invitationRejected = useCallback(() => {
    setPendingInvitation(false);
    setObjectNotification({ show: true, message: 'Invitation rejected by the user', type: Constants.ERROR });
  }, [setObjectNotification]);

  useEffect(() => {
    red5ProService.addHousekeeperMethodUpdateCallback(red5ProService.conferenceConnection?.roomName, invitationRejected);
  }, [red5ProService, invitationRejected]);

  const stopButton = (participant: IParticipantSharedObjectData) => {
    return (
      <OverlayTrigger placement="right" overlay={<Tooltip id="popover">Stop co-streamer stream</Tooltip>}>
        <Button variant="link" className="stop-co-streaming-button" onClick={() => stopCoStreamerStream(participant.streamName)}>
          <FontAwesomeIcon icon={faStopCircle} />
        </Button>
      </OverlayTrigger>
    );
  };

  const addParticipantButton = (participant: IParticipantSharedObjectData) => {
    return (
      <OverlayTrigger placement="right" overlay={<Tooltip id="button-start-co-streaming">Invite to co-stream</Tooltip>}>
        <Button
          variant="link"
          disabled={!!pendingInvitation || costreamerExists}
          className="add-participant-button"
          onClick={() => sendInvitation(participant.streamName)}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </Button>
      </OverlayTrigger>
    );
  };

  const cancelInvitationButton = (participant: IParticipantSharedObjectData) => {
    return (
      <OverlayTrigger placement="right" overlay={<Tooltip id="button-start-co-streaming">Cancel Invite</Tooltip>}>
        <Button variant="link" className="cancel-invitation" onClick={() => cancelInvitation(participant.streamName)}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </Button>
      </OverlayTrigger>
    );
  };

  const renderParticipantButton = (participant: IParticipantSharedObjectData) => {
    if (participant.status === Constants.PARTICIPANT_ROLES.VIEWERS) {
      if (participant.streamName === pendingInvitation) {
        return cancelInvitationButton(participant);
      }
      return addParticipantButton(participant);
    }
    return stopButton(participant);
  };

  const list = (
    <ListGroup>
      {participantsKeys.map((key: string) => (
        <ListGroup.Item className="list-item" key={participants[key].streamName}>
          <div className="participant-row">
            <div className="participant-container">
              {participants[key].additionalData?.askedToJoin ? (
                <FontAwesomeIcon icon={faHandPaper} className="color-primary" />
              ) : (
                <FontAwesomeIcon icon={faUserAlt} />
              )}
              <div className="participant-username">{participants[key].streamName}</div>
            </div>
            {renderParticipantButton(participants[key])}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  return props.showList ? list : null;
};

export default ParticipantsList;
