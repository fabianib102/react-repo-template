import { enableFetchMocks } from 'jest-fetch-mock';
import { requestOrigin, requestEdge, requestTranscoder } from '../../src/services/StreamManager';
import { streamManagerApiUrl } from '../../src/services/red5pro.config';
import Constants from '../../src/assets/utils/Constants';

jest.mock('../../src/assets/utils/Constants', () => ({
  ...jest.requireActual('../../src/assets/utils/Constants'),
  STREAM_MANAGER: {
    BROADCAST: 'broadcast',
    SUBSCRIBE: 'subscribe',
    BROADCAST_ABR: 'broadcast_abr',
    RETRIES: 2,
    RETRY_TIMEOUT_MS: 40,
  },
}));

const streamName = 'id';

const response = {
  host: 'mockedOriginEndpoint',
  serverAddress: '10.0.0.1',
  scope: 'live',
  region: 'a-region',
};

const headers = { 'content-type': 'application/json' };
const badHeaders = { 'content-type': 'text/html' };

const typeError = 'Could not properly parse response.';
const errorMessage = 'fake error message';

describe('StreamManager service layer should', () => {
  beforeEach(() => {
    enableFetchMocks();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('Method requestOrigin call made to correct URL', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers });
    await requestOrigin(streamName);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${streamManagerApiUrl}${streamName}?action=broadcast`);
  });

  it('Method requestEdge call made to correct URL', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers });
    await requestEdge(streamName);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${streamManagerApiUrl}${streamName}?action=subscribe`);
  });

  it('Method requestEdge should retry N times', async (done) => {
    fetch.mockResponse(JSON.stringify(response), { status: 400 });
    try {
      await requestEdge(streamName);
      expect(false).toBeTrue();
    } catch {
      expect(fetch.mock.calls.length).toEqual(Constants.STREAM_MANAGER.RETRIES + 1);
    }
    done();
  });

  it('Method requestOrigin returns proper response object', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers });
    const expectedResponse = await requestOrigin(streamName);
    expect(expectedResponse.serverAddress).toEqual(response.serverAddress);
    expect(expectedResponse.scope).toEqual(response.scope);
  });

  it('Method requestOrigin throws if content-type does not match', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers: badHeaders });
    try {
      await requestOrigin(streamName);
    } catch (e) {
      expect(e.message).toEqual(typeError);
    }
  });

  it('Method requestEdge throws if content-type does not match', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers: badHeaders });
    try {
      await requestEdge(streamName);
    } catch (e) {
      expect(e.message).toEqual(typeError);
    }
  });

  it('Method requestEdge returns proper response object', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers });
    const expectedResponse = await requestEdge(streamName);
    expect(expectedResponse.serverAddress).toEqual(response.serverAddress);
    expect(expectedResponse.scope).toEqual(response.scope);
  });

  it('Method requestOrigin returns error message on failure', async () => {
    fetch.mockReject(new Error(errorMessage));
    try {
      await requestOrigin(streamName);
    } catch (e) {
      expect(e.message).toEqual(errorMessage);
    }
  });

  it('Method requestEdge returns error message on failure', async () => {
    fetch.mockReject(new Error(errorMessage));
    try {
      await requestEdge(streamName);
    } catch (e) {
      expect(e.message).toEqual(errorMessage);
    }
  });

  it('Method requestTranscoder call made to correct URL', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers });
    await requestTranscoder(streamName);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${streamManagerApiUrl}${streamName}?action=broadcast&transcode=true`);
  });

  it('Method requestTranscoder returns proper response object', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers });
    const expectedResponse = await requestTranscoder(streamName);
    expect(expectedResponse.serverAddress).toEqual(response.serverAddress);
    expect(expectedResponse.scope).toEqual(response.scope);
  });

  it('Method requestTranscoder throws if content-type does not match', async () => {
    fetch.mockResponse(JSON.stringify(response), { headers: badHeaders });
    try {
      await requestTranscoder(streamName);
    } catch (e) {
      expect(e.message).toEqual(typeError);
    }
  });

  it('Method requestTranscoder returns error message on failure', async () => {
    fetch.mockReject(new Error(errorMessage));
    try {
      await requestTranscoder(streamName);
    } catch (e) {
      expect(e.message).toEqual(errorMessage);
    }
  });
});
