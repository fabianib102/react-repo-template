import React, { FC } from 'react';
import '../../assets/css/consumer-app/LiveFeedData.scss';
import { useChannel } from '../../context/ChannelContext';

const LiveFeedData: FC = () => {
  const {
    selectedChannel: { channelName, createdOn },
  } = useChannel();

  return (
    <>
      <div className="channel-name">{channelName}</div>
      <div className="user">{`User-${createdOn}`}</div>
    </>
  );
};

export default LiveFeedData;
