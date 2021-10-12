import React, { FC, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../assets/css/consumer-app/ConsumerActionStyles.scss';
import '../../assets/css/Styles.scss';
import { faHandPaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TooltipPlacement } from '../../assets/utils/Enums';
import StopButton from '../conference/participants/StopButton';
import QuickActionButton from '../conference/quickActions/QuickActionButton';

interface Props {
  isCoStreamer: boolean;
  stopCoStreaming: () => Promise<void>;
  updateAskedToJoinStatus: (askedToiJoin: boolean) => Promise<void>;
}

const ConsumerActions: FC<Props> = (props: Props) => {
  const askToJoinTitle = 'Ask to Join';
  const dismissRequestTitle = 'Dismiss request to join';
  const [askedToJoin, setAskToJoin] = useState(false);
  const [toggleAskToJoinTitle, setToggleAskToJoinTitle] = useState(askToJoinTitle);

  const toggleAskToJoin = async () => {
    await props.updateAskedToJoinStatus(!askedToJoin);
    setAskToJoin(!askedToJoin);
  };

  useEffect(() => {
    const askToJoinButtonTitle = askedToJoin ? dismissRequestTitle : askToJoinTitle;
    setToggleAskToJoinTitle(askToJoinButtonTitle);
  }, [askedToJoin]);

  return (
    <>
      <Row className="consumer-actions d-flex align-items-center">
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          {props.isCoStreamer && <StopButton stopCoStreaming={props.stopCoStreaming} />}
          <QuickActionButton
            title={toggleAskToJoinTitle}
            icon={<FontAwesomeIcon icon={faHandPaper} />}
            onClick={toggleAskToJoin}
            className={askedToJoin ? 'asked-to-join' : 'ask-to-join'}
            tooltipPlacement={TooltipPlacement.top}
          />
        </Col>
      </Row>
    </>
  );
};

export default ConsumerActions;
