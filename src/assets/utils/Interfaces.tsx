import { EventTypes } from '@southworks/custom-shared-object-client';
import Participant, { IAdditionalData } from '../../services/Participant';

interface ISharedObjectEventWithCallback {
  type: EventTypes;
  callback(event: any): any;
}

interface IRed5ProService {
  red5ProSdk: any;
  conferenceConnection: any;
  publisherConnection: any;
  originConfiguration: any;
  transcoderConfiguration: any;
  streamName: string;
  sendNotification: any;
  publisherEvents: any;
  participant: Participant;
  getConferenceConfiguration: () => any;
  getPublisherConfiguration: () => any;
  getScreenShareConfiguration: () => any;
  initPublisher: (mediaConfig: Record<string, unknown>) => Promise<void>;
  setTranscoderEndpoint: () => Promise<void>;
  setOriginEndpoint: () => Promise<void>;
  leaveConference: () => Promise<void>;
  getCurrentStream: () => MediaStream;
  addHousekeeperMethodUpdateCallback: (methodName: string, callback: (event: any) => void) => void;
  getParticipantsList: () => Record<string, IParticipantSharedObjectData>;
  getStreamersList: () => Array<IStream>;
  accessConference: (conferenceId: string, role: string, participantNickName: string) => Promise<void>;
  startCoStreaming: (callback: () => void) => Promise<void>;
  stopCoStreaming: () => Promise<void>;
  startScreenSharing: () => Promise<MediaStream>;
  stopScreenSharing: () => Promise<void>;
  joinParticipant: (participant: Participant, status: string) => void;
  addEndedShareScreenEventCallback: (callback: () => Promise<void>) => void;
  addConnectionSuccessCallback: (callback: () => void) => void;
  addConnectionFailureCallback: (callback: () => void) => void;
  addPropertyUpdateCallback: (callback: () => void) => void;
  unpublish: () => Promise<void>;
  publish: () => Promise<void>;
  addPublisherEventCallback: (eventType: string, callbackFn: () => void) => void;
  toggleHand: (value: boolean) => void;
  setStreamName: (name?: string) => void;
  initConference: (newRoomName: string | undefined) => Promise<void>;
  setAuthParams: (token: string) => void;
}

interface IParticipantSharedObjectData {
  status: string | undefined;
  action: string;
  startTime: number;
  timestamp: number;
  streamName: string;
  additionalData: IAdditionalData;
}

interface IOwnResource {
  id: string;
  mediaStream: MediaStream;
}

interface IDeviceConfiguration {
  video: {
    deviceId: string;
    w: number;
    h: number;
  };
  audio: {
    deviceId: string;
    label: string;
  };
}

interface IDevices {
  id: string;
  name: string;
}

interface IRenditions {
  value: string;
  disabled: boolean;
  w: number;
  h: number;
}

interface IStream {
  streamName: string;
  action: string;
}

interface IEventCallback {
  type: string;
  callback: (event: any) => void;
}

interface IAuthData {
  progress: string;
  accessToken: string;
  idToken: string;
  exp: number;
  email: string;
  name: string;
  username: string;
  awsCredentials: {
    accessKeyId: string;
    authenticated: boolean;
    identityId: string;
    secretAccessKey: string;
    sessionToken: string;
  };
}

interface IAuthParams {
  username: string;
  password: string;
  token: string;
}

export type {
  ISharedObjectEventWithCallback,
  IRed5ProService,
  IParticipantSharedObjectData,
  IOwnResource,
  IDeviceConfiguration,
  IDevices,
  IRenditions,
  IStream,
  IEventCallback,
  IAuthData,
  IAuthParams,
};
