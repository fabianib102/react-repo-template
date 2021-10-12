import React, { useState, useEffect, FC } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import ChannelsTable from './ChannelsTable';
import ChannelService from '../services/ChannelService';
import NewChannelModal from './NewChannelModal';
import { useLoader } from '../context/LoaderContext';
import '../assets/css/Styles.scss';
import Constants from '../assets/utils/Constants';
import Red5ProContext from '../context/Red5ProServiceContext';

const channelService = new ChannelService();

interface Props {
  shownotification: any;
}

const Home: FC<Props> = (props: Props) => {
  const [channels, setChannels] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const { setIsLoading } = useLoader();
  const { red5ProService } = Red5ProContext.useRed5Pro();

  useEffect(() => {
    red5ProService.leaveConference();
    getChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChannels = async () => {
    try {
      setIsLoading(true);
      const { data } = await channelService.getChannels();
      setChannels(data);
    } catch (err: any) {
      props.shownotification(Constants.ERROR, err.message, Constants.ERROR);
    }
    setIsLoading(false);
  };

  const onSuccessCreateChannel = async () => {
    setModalShow(false);
    await getChannels();
  };

  const onNewChannelModalClose = () => {
    setModalShow(false);
  };

  const onDeleteChannel = async () => {
    await getChannels();
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button id="createButton" className="button-create" onClick={() => setModalShow(true)}>
            {`CREATE ${Constants.CHANNEL_LABEL.toUpperCase()}`}
          </Button>
          <ChannelsTable shownotification={props.shownotification} data={channels} onDeleteChannel={onDeleteChannel} />
        </Col>
      </Row>
      <NewChannelModal
        shownotification={props.shownotification}
        show={modalShow}
        onSuccessCreateChannel={onSuccessCreateChannel}
        onClose={onNewChannelModalClose}
      />
      <Button href={`/${Constants.INFRASTRUCTURE_PATH}`} className="infrastructure-link">
        Infrastructure
      </Button>
    </Container>
  );
};

export default Home;
