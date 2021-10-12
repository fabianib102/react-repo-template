import React, { FC, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';
import SubComponentHeader from '../SubComponentHeader';
import QuickActionButton from './QuickActionButton';
import ParticipantsButton from '../participants/ParticipantsButton';
import { IParticipantSharedObjectData, IRed5ProService } from '../../../assets/utils/Interfaces';
import { TooltipPlacement } from '../../../assets/utils/Enums';
import '../../../assets/css/Styles.scss';
import '../../../assets/css/QuickActionsStyles.scss';

interface Props {
  participantsList: Record<string, IParticipantSharedObjectData>;
  red5ProService: IRed5ProService;
  shareScreenCallback: (isSharingScreen: boolean) => Promise<void>;
}

const QuickActions: FC<Props> = (props: Props) => {
  const { red5ProService, shareScreenCallback, participantsList } = props;
  const [toggleScreenTitle, setToggleScreenTitle] = useState('Share Screen');
  const [isSharing, _setIsSharing] = useState(false);
  const isSharingRef = useRef(isSharing);
  const setIsSharing = (value: boolean) => {
    isSharingRef.current = value;
    _setIsSharing(value);
  };

  useEffect(() => {
    const newTitle = isSharing ? 'Stop Share Screen' : 'Screen Share';
    setToggleScreenTitle(newTitle);
  }, [isSharing]);

  const onScreenSharedChange = async () => {
    try {
      await shareScreenCallback(isSharingRef.current);
      setIsSharing(!isSharingRef.current);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    red5ProService.addEndedShareScreenEventCallback(onScreenSharedChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const presenterButtons = (
    <>
      <QuickActionButton
        title={toggleScreenTitle}
        onClick={onScreenSharedChange}
        tooltipPlacement={TooltipPlacement.right}
        icon={<FontAwesomeIcon icon={faShareSquare} />}
        className={`share-screen-button ${isSharing ? 'toggled-on' : 'toggled-off'}`}
      />
      <ParticipantsButton participantsList={participantsList} red5ProService={red5ProService} />
    </>
  );

  return (
    <>
      <SubComponentHeader title="Actions" showHeader />
      <Row className="row-sub-header ">
        <Col xs={12} className="action-buttons">
          {presenterButtons}
        </Col>
      </Row>
    </>
  );
};

export default QuickActions;
