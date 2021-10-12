import { streamManagerApiUrl } from './red5pro.config';
import { sleep } from './GeneralService';
import Constants from '../assets/utils/Constants';

export const requestTranscoder = async (streamName: string) => {
  return requestEndpoint(streamName, Constants.STREAM_MANAGER.BROADCAST_ABR);
};

export const requestOrigin = async (streamName: string) => {
  return requestEndpoint(streamName, Constants.STREAM_MANAGER.BROADCAST);
};

export const requestEdge = async (streamName: string) => {
  return requestEndpoint(streamName, Constants.STREAM_MANAGER.SUBSCRIBE);
};

const getRequestEndpointParams = (operationToRetrieve: string) => {
  return operationToRetrieve === Constants.STREAM_MANAGER.BROADCAST_ABR
    ? `action=${Constants.STREAM_MANAGER.BROADCAST}&transcode=true`
    : `action=${operationToRetrieve}`;
};

const requestEndpoint = async (streamName: string, operation: string) => {
  const url = `${streamManagerApiUrl}${streamName}?${getRequestEndpointParams(operation)}`;
  try {
    const jsonResponse = await fetchRetry(url, Constants.STREAM_MANAGER.RETRIES, Constants.STREAM_MANAGER.RETRY_TIMEOUT_MS);
    return jsonResponse;
  } catch (err) {
    const errorToLog = typeof err === 'string' ? err : JSON.stringify(err, null, 2);
    console.error(`[Stream Manager] Error - Could not request IP for ${operation}. ${errorToLog}`);
    throw err;
  }
};

const checkResponse = async (response: any) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }
  throw new TypeError('Could not properly parse response.');
};

const fetchRetry: any = async (url: string, attempts: number, timeout: number) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw Error(response.statusText);
    return await checkResponse(response);
  } catch (err) {
    if (attempts === 0) throw err;
    await sleep(timeout);
    return fetchRetry(url, attempts - 1, timeout);
  }
};
