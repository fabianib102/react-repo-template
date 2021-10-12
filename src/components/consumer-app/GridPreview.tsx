import React, { FC, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi';
import { Red5ProSubscriber } from '@southworks/red5pro-player';
import Constants from '../../assets/utils/Constants';
import ChannelService from '../../services/ChannelService';
import Red5ProContext from '../../context/Red5ProServiceContext';
import '../../assets/css/consumer-app/GridPreview.scss';

const channelService = new ChannelService();

const GridPreview: FC = () => {
  const { red5ProService } = Red5ProContext.useRed5Pro();
  const [channelList, setChannelList] = useState<Array<any>>([]);
  const [focusedFeed, setFocusedFeed] = useState('');
  const subscriberCredentials = Constants.SUBSCRIBER_CREDENTIALS;

  useEffect(() => {
    const getOnlineChannels = () => {
      const getStreamers = async () => {
        const { data: channels } = await channelService.getChannelsByStatus('online', Constants.GRID_PREVIEW_MAX_VIDEOS_IN_SCREEN);
        setChannelList(channels);
      };

      getStreamers();
    };

    getOnlineChannels();
    const channelsInterval = setInterval(getOnlineChannels, 5000);

    return () => {
      clearInterval(channelsInterval);
    };
  }, [red5ProService]);

  const fullScreenIcon = (channelId: string) =>
    focusedFeed === channelId ? (
      <BiExitFullscreen onClick={() => setFocusedFeed('')} className="unfocus-feed-button" title="Unfocus this feed" />
    ) : (
      <BiFullscreen onClick={() => setFocusedFeed(channelId)} className="focus-feed-button" title="Focus this feed" />
    );

  return (
    <Container fluid className={`consumer-grid-preview ${focusedFeed ? 'has-focused-feed' : ''}`}>
      {channelList.map(
        (channel, index) =>
          index < Constants.GRID_PREVIEW_MAX_VIDEOS_IN_SCREEN && (
            <div key={`${channel.id}-pub`} className={`live-feed-wrapper ${focusedFeed === channel.id ? 'focused' : ''}`}>
              <Red5ProSubscriber
                streamName={channel.id as string}
                host={process.env.REACT_APP_STREAM_MANAGER_URL as string}
                id={`${channel.id}-pub`}
                className="live-feed"
                autoPlay
                useAuth
                authParams={subscriberCredentials}
                offlineMessage="Offline"
              />
              <div className="live-feed-icons">
                {channel.channelName}
                {channelList.length > 1 && fullScreenIcon(channel.id)}
              </div>
            </div>
          )
      )}
    </Container>
  );
};

export default GridPreview;
