import ApiService from './ApiService';
import { streamManagerAbrApiUrl } from './red5pro.config';

export default class AbrService {
  apiService = new ApiService(streamManagerAbrApiUrl, {
    'Content-Type': 'application/json',
  });

  createStreamProvision = (streamName: string, abrConfig: any) => {
    return this.apiService.post(`${streamName}?accessToken=${process.env.REACT_APP_ACCESS_TOKEN}`, abrConfig);
  };

  deleteStreamProvision = (streamName: string) => {
    return this.apiService.delete(`${streamName}?accessToken=${process.env.REACT_APP_ACCESS_TOKEN}`);
  };
}
