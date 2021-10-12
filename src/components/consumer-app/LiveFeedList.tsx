import React, { FC, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import ChannelService from '../../services/ChannelService';
import { useLoader } from '../../context/LoaderContext';
import { useShowNotification } from '../../context/ShowNotificationContext';
import Constants from '../../assets/utils/Constants';
import LiveFeedCard from './LiveFeedCard';
import '../../assets/css/consumer-app/LiveFeedList.scss';
import { Channel } from '../../models/Channel';

const channelService = new ChannelService();

const LiveFeedList: FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const { setObjectNotification } = useShowNotification();
  const { setIsLoading } = useLoader();

  useEffect(() => {
    getChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChannels = async () => {
    try {
      setIsLoading(true);
      const { data } = await channelService.getChannels();
      setChannels(data);
    } catch (err: any) {
      setObjectNotification({ show: true, message: err.msj, type: Constants.ERROR });
    }
    setIsLoading(false);
  };

  return (
    <Container fluid className="mw-960 livefeed-container">
      {channels.map((channel) => (
        <LiveFeedCard channel={channel} key={channel.id} />
      ))}
    </Container>
  );
};

export default LiveFeedList;
