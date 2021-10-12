import React, { FC, useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import QuickActionButton from '../quickActions/QuickActionButton';
import ParticipantsList from './ParticipantsList';
import { IParticipantSharedObjectData, IRed5ProService } from '../../../assets/utils/Interfaces';
import '../../../assets/css/Styles.scss';
import '../../../assets/css/ParticipantsButton.scss';
import { TooltipPlacement } from '../../../assets/utils/Enums';

interface Props {
  participantsList: Record<string, IParticipantSharedObjectData>;
  red5ProService: IRed5ProService;
}

const QuickActions: FC<Props> = (props: Props) => {
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const participantsAmount = Object.keys(props.participantsList).length;

  useEffect(() => {
    if (participantsAmount <= 0) {
      setShowParticipantsList(false);
    }
  }, [participantsAmount]);

  return (
    <>
      <div className="participants-panel">
        <Col>
          <div className="participants-button-container">
            <div className="participant-amount">{participantsAmount}</div>
            <QuickActionButton
              title="Participants"
              icon={<FontAwesomeIcon icon={faUser} />}
              onClick={() => {
                setShowParticipantsList(!showParticipantsList && participantsAmount > 0);
              }}
              tooltipPlacement={TooltipPlacement.right}
            />
          </div>
        </Col>
        <Col className="participants-column">
          <ParticipantsList participants={props.participantsList} showList={showParticipantsList} red5ProService={props.red5ProService} />
        </Col>
      </div>
    </>
  );
};

export default QuickActions;
