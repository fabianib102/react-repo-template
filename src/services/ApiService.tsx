/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';

export default class ApiService {
  client: any;

  constructor(baseURL: string | undefined, headers: any) {
    this.client = axios.create({
      baseURL,
      headers,
    });
  }

  get = (endpoint: string) => {
    return this.client.get(endpoint);
  };

  post = (endpoint: string, data: any) => {
    return this.client.post(endpoint, data);
  };

  delete = (endpoint: string) => {
    return this.client.delete(endpoint);
  };

  update = (endpoint: string, data: any) => {
    return this.client.put(endpoint, data);
  };
}
