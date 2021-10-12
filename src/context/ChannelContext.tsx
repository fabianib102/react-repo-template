import { createContext, useContext } from 'react';
import { Channel } from '../models/Channel';

export interface ChannelContextProvider {
  selectedChannel: Channel;
  setSelectedChannel: (newChannel: Channel) => void;
}

export const selectedChannel = {
  id: 'channelname',
  channelName: 'ChannelName',
  hasAbr: false,
  createdOn: Date.now(),
  streamId: 'channelname',
  channelStatus: 'offline',
  ingestUrl: 'rtmp://saraza/live',
  protocol: 'webrtc',
};

export const CHANNEL_CONTEXT_DEFAULT_VALUE = {
  selectedChannel: { ...selectedChannel },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelectedChannel: (_: Channel) => {},
};

export const ChannelContext = createContext<ChannelContextProvider>(CHANNEL_CONTEXT_DEFAULT_VALUE);

export const useChannel = () => {
  return useContext(ChannelContext);
};
