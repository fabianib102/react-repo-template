import React, { FC } from 'react';
import { Row, Container, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LiveFeedList from './LiveFeedList';
import Constants from '../../assets/utils/Constants';
import '../../assets/css/consumer-app/ConsumerHome.scss';

const ConsumerHome: FC = () => {
  const history = useHistory();

  const goToGridPreview = () => {
    history.push(`/${Constants.CONSUMER_APP_PATH}/grid-preview`);
  };

  return (
    <Container fluid className="mw-960 consumer-home">
      <Row className="consumer-title justify-content-center">
        <div>LIVESTREAMS</div>
      </Row>
      <Row className="pb-4 justify-content-center">
        <Button onClick={goToGridPreview}>See grid preview</Button>
      </Row>
      <Row>
        <LiveFeedList />
      </Row>
    </Container>
  );
};

export default ConsumerHome;
