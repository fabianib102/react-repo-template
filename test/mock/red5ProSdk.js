/* eslint-disable max-classes-per-file */
class RTCPublisher {
  constructor() {
    this.events = [];
    this.config = {};
    this.mediaStream = undefined;
    this.currentTracks = [
      {
        contentHint: '',
        enabled: true,
        id: 'audio-1234567890',
        kind: 'audio',
        label: 'Default Audio Device',
        muted: false,
        onended: null,
        onmute: null,
        onunmute: null,
        readyState: 'live',
        stop: () => {
          return true;
        },
        addEventListener: () => {},
      },
      {
        contentHint: '',
        enabled: true,
        id: 'camera-1234567890',
        kind: 'video',
        label: 'Default Camera Device',
        muted: false,
        onended: null,
        onmute: null,
        onunmute: null,
        readyState: 'live',
        stop: () => {
          return true;
        },
        addEventListener: () => {},
      },
    ];
    this.peerConnection = {
      getSenders: () => {
        return [
          {
            track: {
              kind: 'audio',
              enabled: true,
            },
            getParameters: () => {
              return {
                encodings: [
                  {
                    active: true,
                  },
                ],
              };
            },
            setParameters: (param) => {
              return Promise.resolve(param);
            },
          },
          {
            track: {
              kind: 'video',
              enabled: true,
            },
            getParameters: () => {
              return {
                encodings: [
                  {
                    active: true,
                  },
                ],
              };
            },
            setParameters: (param) => {
              return Promise.resolve(param);
            },
          },
        ];
      },
    };
  }

  init(config) {
    this.config = config;
    return Promise.resolve(this);
  }

  initWithStream(config, mediaStream) {
    this.config = config;
    this.mediaStream = mediaStream;
    return Promise.resolve(this);
  }

  on(type, callback) {
    this.events.push({ type, callback });
  }

  off(type, callback) {
    const filteredList = this.events.filter((event) => !(event.type === type && event.callback === callback));
    this.events = filteredList;
  }

  getOptions() {
    return this.config;
  }

  getMediaStream() {
    return {
      mediaStream: this.mediaStream,
      getTracks: () => {
        return this.currentTracks;
      },
      getAudioTracks: () => {
        return Array(this.currentTracks[0]);
      },
      getVideoTracks: () => {
        return Array(this.currentTracks[1]);
      },
    };
  }

  publish(streamName) {
    const id = streamName || this.config.streamName;
    if (id === '' || !id) {
      return Promise.reject(new Error('id is empty'));
    }
    return Promise.resolve(id);
  }

  unpublish() {
    return Promise.resolve(this);
  }

  muteAudio() {
    this.currentTracks[0].muted = true;
    return true;
  }

  unmuteAudio() {
    this.currentTracks[0].muted = false;
    return true;
  }

  muteVideo() {
    this.currentTracks[1].muted = true;
    return true;
  }

  unmuteVideo() {
    this.currentTracks[1].muted = false;
    return true;
  }

  getPeerConnection() {
    return this.peerConnection;
  }
}

class RTCSubscriber {
  constructor() {
    this.events = [];
    this.config = {};
  }

  init(config) {
    this.config = config;
    return Promise.resolve(this);
  }

  on(type, callback) {
    this.events.push({ type, callback });
  }

  off(type, callback) {
    const filteredList = this.events.filter((event) => !(event.type === type && event.callback === callback));
    this.events = filteredList;
  }

  subscribe() {
    return Promise.resolve(this);
  }

  unsubscribe() {
    return Promise.resolve(this);
  }
}

class Red5ProSharedObjectSocket {
  constructor() {
    this.config = undefined;
  }

  init(config) {
    this.config = config;
    return Promise.resolve(this);
  }

  close() {
    this.config = undefined;
    return true;
  }
}

class Red5ProSharedObject {
  constructor(name, socket) {
    this.name = name;
    this.socket = socket;
    this.events = [];
  }

  on(type, callback) {
    this.events.push({ type, callback });
  }

  off(type, callback) {
    const filteredList = this.events.filter((event) => !(event.type === type && event.callback === callback));
    this.events = filteredList;
  }

  close() {
    this.socket = undefined;
    return true;
  }

  setProperty(key, value) {
    const event = {
      data: {},
    };
    event.data[key] = JSON.parse(value);
    const callbackIndex = this.events.findIndex((callback) => callback.type === SharedObjectEventTypes.PROPERTY_UPDATE);
    if (callbackIndex === -1) return;
    this.events[callbackIndex].callback(event);
  }
}

const SharedObjectEventTypes = {
  CONNECT_SUCCESS: 'Connect.Success',
  CONNECT_FAILURE: 'Connect.Failure',
  PROPERTY_UPDATE: 'SharedObject.PropertyUpdate',
  METHOD_UPDATE: 'SharedObject.METHOD_UPDATE',
};

const RTCPublisherEventTypes = {
  CONSTRAINTS_REJECTED: 'WebRTC.MediaConstraints.Rejected',
  MEDIA_STREAM_AVAILABLE: 'WebRTC.MediaStream.Available',
  PEER_CONNECTION_OPEN: 'WebRTC.PeerConnection.Open',
};

const PublisherEventTypes = {
  CONNECTION_CLOSED: 'Publisher.Connection.Closed',
};

const SubscriberEventTypes = {
  PLAYBACK_TIME_UPDATE: 'Subscribe.Time.Update',
  SUBSCRIBE_METADATA: 'Subscribe.Metadata',
  CONNECTION_CLOSED: 'Subscribe.Connection.Closed',
  SUBSCRIBE_INVALID_NAME: 'Subscribe.InvalidName',
};

module.exports = {
  RTCPublisher,
  RTCSubscriber,
  Red5ProSharedObject,
  Red5ProSharedObjectSocket,
  SharedObjectEventTypes,
  RTCPublisherEventTypes,
  SubscriberEventTypes,
  PublisherEventTypes,
};
