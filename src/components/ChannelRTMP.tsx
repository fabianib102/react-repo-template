import React, { useEffect, FC, useState } from 'react';
import { OverlayTrigger, Tooltip, Row, Col, Spinner } from 'react-bootstrap';
import { FaRedo } from 'react-icons/fa';
import TextBoxToCopy from './TextBoxToCopy';
import ChannelService from '../services/ChannelService';
import { Channel } from '../models/Channel';
import Constants from '../assets/utils/Constants';
import { rtmpConfiguration } from '../services/red5pro.config';

interface Props {
  channel?: Channel;
  setChannel?: any;
  shownotification?: any;
  channelId: string;
}

const ChannelRTMP: FC<Props> = (props: Props) => {
  const channelService = new ChannelService();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    channelService.updateIngestEndpointIP(props.channelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshIngestIp = async () => {
    setIsLoading(true);
    try {
      await channelService.updateIngestEndpointIP(props.channelId);
      props.shownotification(Constants.SUCCESS, Constants.ORIGIN_REQUEST_SUCCESS, Constants.RTMP_PROTOCOL);
    } catch (error) {
      console.log(error);
      props.shownotification(Constants.ERROR, Constants.ORIGIN_REQUEST_ERROR, Constants.RTMP_PROTOCOL);
    }
    setIsLoading(false);
  };

  return (
    <Row>
      <Col md={12} className="mt-2">
        <span>Ingest Endpoint</span>
        <TextBoxToCopy
          customId="ingest-endpoint"
          textValue={
            props.channel?.ingestUrl
              ? props.channel?.ingestUrl
              : `${rtmpConfiguration.protocol}://${props.channelId}.` +
                `${process.env.REACT_APP_HOSTED_ZONE_DOMAIN}:${rtmpConfiguration.port}/${Constants.LIVE}`
          }
          tooltipHideTimeout={500}
          additionalIcon={
            <OverlayTrigger rootClose placement="top" overlay={<Tooltip id="popover">Refresh Ingest Endpoint</Tooltip>}>
              <div>{isLoading ? <Spinner size="sm" animation="border" id="spinner-rtmp" /> : <FaRedo id="refresh-rtmp" />}</div>
            </OverlayTrigger>
          }
          additionalIconHandler={refreshIngestIp}
        />
        <span>Stream Key</span>
        <TextBoxToCopy textValue={props.channelId} tooltipHideTimeout={500} customId="stream-key" />
      </Col>
    </Row>
  );
};

ChannelRTMP.defaultProps = {
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
  setChannel: () => {},
  shownotification: () => {},
};

export default ChannelRTMP;
