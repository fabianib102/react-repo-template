import ApiService from './ApiService';
import { streamManagerStreamScope, statsPath } from './red5pro.config';

export default class AbrService {
  apiService = new ApiService(streamManagerStreamScope, {
    'Content-Type': 'application/json',
  });

  getStreamStatistics = async (streamName: string) => {
    return this.apiService.get(`/${streamName}${statsPath}`);
  };
}
