export const configuration = {
  host: process.env.REACT_APP_STREAM_MANAGER_URL,
  protocol: 'wss',
  httpProtocol: 'https',
  port: 443,
  app: 'live',
  proxy: 'streammanager',
  streamMode: 'live',
  streamManagerAPI: '4.0',
};

export const streamManagerApiUrl = `
  ${configuration.httpProtocol}://${configuration.host}/streammanager/api/${configuration.streamManagerAPI}/event/${configuration.app}/
`;

export const streamManagerAbrApiUrl = `
  ${configuration.httpProtocol}://${configuration.host}/streammanager/api/${configuration.streamManagerAPI}/admin/event/meta/${configuration.app}
`;

export const streamManagerStreamScope = `
  ${configuration.httpProtocol}://${configuration.host}/streammanager/api/${configuration.streamManagerAPI}/event/${configuration.app}`;

export const statsPath = `/stats`;

export const rtmpConfiguration = {
  port: '1935',
  protocol: 'rtmp',
};

export const abrConfiguration = {
  meta: {
    qos: 3,
    georules: {
      regions: ['US', 'UK'],
      restricted: false,
    },
    stream: [
      {
        level: 3,
        name: '',
        properties: {
          videoBR: 128000,
          videoHeight: 180,
          videoWidth: 320,
        },
      },
      {
        level: 2,
        name: '',
        properties: {
          videoBR: 512000,
          videoHeight: 360,
          videoWidth: 640,
        },
      },
      {
        level: 1,
        name: '',
        properties: {
          videoBR: 1000000,
          videoHeight: 720,
          videoWidth: 1280,
        },
      },
    ],
  },
};
