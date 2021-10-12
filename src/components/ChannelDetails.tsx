import React, { useState, useEffect, FC } from 'react';
import { Tab, Button, Row, Col, Container, Form, Tabs } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Channel } from '../models/Channel';
import ChannelWebRTC from './ChannelWebRTC';
import ChannelService from '../services/ChannelService';
import TextBoxToCopy from './TextBoxToCopy';
import ChannelRTMP from './ChannelRTMP';
import Constants from '../assets/utils/Constants';
import '../assets/css/ChannelDetailsStyles.scss';
import '../assets/css/Styles.scss';
import { useLoader } from '../context/LoaderContext';
import Red5ProContext from '../context/Red5ProServiceContext';

const channelService = new ChannelService();

interface Props {
  shownotification?: any;
}

const ChannelDetails: FC<Props> = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [channel, setChannel] = useState<Channel>();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [key, setKey] = useState<string | null>(Constants.WEBRTC_PROTOCOL);
  const { setIsLoading } = useLoader();
  const { red5ProService } = Red5ProContext.useRed5Pro();

  useEffect(() => {
    const getChannel = async () => {
      try {
        setIsLoading(true);
        const res = await channelService.getChannelById(id);
        if (res.data) {
          setChannel(res.data);
        }
      } catch (err: any) {
        props.shownotification(Constants.ERROR, Constants.GET_CHANNEL_ERROR, Constants.CHANNEL_ERROR);
      }
      setIsLoading(false);
    };
    getChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const GoBack = async () => {
    try {
      await red5ProService.leaveConference();
    } catch (err: any) {
      console.log(err);
      props.shownotification(Constants.ERROR, Constants.UNPUBLISHING_ERROR, Constants.CHANNEL_ERROR);
    } finally {
      history.push('/');
    }
  };

  const onWebRTCPublishing = () => {
    setPublishing(true);
  };

  const onWebRTCPublishedSuccess = () => {
    setPublished(true);
    setPublishing(false);
  };

  const onWebRTCUnpublishedSuccess = () => {
    setPublished(false);
    setPublishing(false);
  };

  const onWebRTCPublishedFailed = () => {
    setPublished(false);
    setPublishing(false);
  };

  const useABR = (
    <Row>
      <Col>
        <Form.Check disabled type="checkbox" label="Use ABR" id="checkABR" checked={channel?.hasAbr} />
        <br />
      </Col>
    </Row>
  );

  const broadcasterPreview = (
    <div>
      <span>Broadcaster preview</span>
      <ChannelWebRTC
        streamId={id}
        onPublishing={onWebRTCPublishing}
        onPublishedSuccess={onWebRTCPublishedSuccess}
        onUnpublishedSuccess={onWebRTCUnpublishedSuccess}
        onPublishedFailed={onWebRTCPublishedFailed}
        shownotification={props.shownotification}
        channel={channel}
        red5ProService={red5ProService}
        setIsLoadingResources={setIsLoadingResources}
      />
    </div>
  );

  const WebRTCTab = (
    <>
      {useABR}
      <Row>
        <Col>{broadcasterPreview}</Col>
      </Row>{' '}
    </>
  );

  const RTMPTab = (
    <>
      {useABR}
      <Row>
        <Col>
          <ChannelRTMP channel={channel} setChannel={setChannel} channelId={id} shownotification={props.shownotification} />
        </Col>
      </Row>
    </>
  );

  const content = (
    <Container className="channel-details">
      <Row className="pre-conference-title align-items-center">
        <Button id="backButton" onClick={GoBack} className="back-button button-primary" disabled={isLoadingResources}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Col className="pull-left">
          <h2>{channel?.channelName}</h2>
        </Col>
      </Row>
      <br />
      <Tabs id="tabs-channel-details" activeKey={key} onSelect={(k) => setKey(k)}>
        <Tab eventKey={Constants.RTMP_PROTOCOL} title="RTMP" disabled className="w-100">
          {key === Constants.RTMP_PROTOCOL ? RTMPTab : null}
        </Tab>
        <Tab eventKey={Constants.WEBRTC_PROTOCOL} title="WebRTC" disabled={publishing || published || isLoadingResources} className="w-100">
          {key === Constants.WEBRTC_PROTOCOL ? WebRTCTab : null}
        </Tab>
      </Tabs>
      <Row>
        <Col className="col-8">
          <Form.Group className="embeddable-iframe">
            <Form.Label>Embed your stream on other websites</Form.Label>
            <TextBoxToCopy
              textValue={`<iframe frameBorder="0" src="${process.env.REACT_APP_EMBEDDABLE_PLAYER_URL}${Constants.QUERY}${channel?.id}"></iframe>`}
              tooltipHideTimeout={500}
              customId="iframe"
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );

  return content;
};

ChannelDetails.defaultProps = {
  shownotification: () => {},
};

export default ChannelDetails;
