import { Channel } from '../models/Channel';
import ApiService from './ApiService';
import Constants from '../assets/utils/Constants';

export default class ChannelService {
  apiService: ApiService;

  constructor() {
    const header = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
    this.apiService = new ApiService(process.env.REACT_APP_BASE_URL, header);
  }

  getChannels() {
    return this.apiService.get(Constants.CHANNEL_ENDPOINT);
  }

  getChannelById(id: string) {
    return this.apiService.get(`${Constants.CHANNEL_ENDPOINT}/${id}`);
  }

  getChannelsByStatus(status: string, limit: number) {
    const filterInUrl = `?channelStatus=${status}&limit=${limit}`;
    return this.apiService.get(`${Constants.CHANNEL_ENDPOINT}${filterInUrl}`);
  }

  createChannel(channel: Channel) {
    return this.apiService.post(Constants.CHANNEL_ENDPOINT, channel);
  }

  deleteChannel(id: string) {
    return this.apiService.delete(`${Constants.CHANNEL_ENDPOINT}/${id}`);
  }

  updateChannel(channel?: Channel) {
    return this.apiService.update(`${Constants.CHANNEL_ENDPOINT}/${channel?.id}`, channel);
  }

  updateIngestEndpointIP(id: any) {
    return this.apiService.post(`${Constants.CHANNEL_ENDPOINT}/${id}/${Constants.UPDATE_INGEST_ENDPOINT}`, null);
  }

  sendChannelInvitations = (id: string, emailsAndCellphonesToSend: any) => {
    return this.apiService.post(`${Constants.CHANNEL_ENDPOINT}/${id}/${Constants.SEND_INVITATION_ENDPOINT}`, emailsAndCellphonesToSend);
  };

  generateCredentials = (id: string, scope: string, userId?: string) => {
    const data = {
      scope,
      userId: userId || id,
    };
    return this.apiService.post(`${Constants.CHANNEL_ENDPOINT}/${id}/${Constants.GENERATE_CREDENTIALS_ENDPOINT}`, data);
  };
}
