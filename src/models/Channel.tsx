export interface Channel {
  id: string;
  channelName: string;
  hasAbr: boolean;
  createdOn: number;
  streamId: string;
  channelStatus: string;
  ingestUrl: string;
  protocol: string;
}
