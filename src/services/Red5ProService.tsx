import lodash from 'lodash';
import { EventTypes } from '@southworks/custom-shared-object-client';
import Constants from '../assets/utils/Constants';
import PublisherItem from './PublisherItem';
import { requestOrigin, requestTranscoder } from './StreamManager';
import { configuration } from './red5pro.config';
import ConferenceItem from './ConferenceItem';
import ScreenShare from './ScreenShare';
import Participant from './Participant';
import { IRed5ProService, IParticipantSharedObjectData, IStream, IAuthParams } from '../assets/utils/Interfaces';
import { generateRandomNumber, createIdScreenShare } from './GeneralService';
import Animals from '../assets/utils/Animals';

const red5prosdk = require('red5pro-html-sdk');

export default class Red5ProService implements IRed5ProService {
  red5ProSdk: any;
  conferenceConnection: any;
  publisherConnection: any;
  screenShareConnection: any;
  transcoderConfiguration: any;
  originConfiguration: any;
  streamName: string;
  sendNotification: any;
  participant: Participant;
  participantScreenShare: Participant;
  shuttingDown: boolean;
  publisherEvents: any;
  authParams: IAuthParams | undefined;
  endedShareScreenEventCallback: () => void;
  connectSuccessCallback: () => void;
  connectFailureCallback: () => void;
  onPropertyProcessing: () => void;

  constructor(notificationHandler: any, sdk?: any) {
    this.red5ProSdk = sdk || red5prosdk;
    this.conferenceConnection = undefined;
    this.publisherConnection = undefined;
    this.screenShareConnection = undefined;
    this.originConfiguration = undefined;
    this.transcoderConfiguration = undefined;
    this.streamName = '';
    this.sendNotification = notificationHandler;
    this.participant = new Participant(Constants.STREAM_ACTIONS.PUBLISH);
    this.participantScreenShare = new Participant(Constants.STREAM_ACTIONS.SCREEN_SHARE);
    this.shuttingDown = false;
    this.publisherEvents = red5prosdk.PublisherEventTypes;
    this.authParams = undefined;
    this.connectSuccessCallback = () => {};
    this.connectFailureCallback = () => {};
    this.onPropertyProcessing = () => {};
    this.endedShareScreenEventCallback = () => {};
    window.addEventListener('beforeunload', () => {
      this.leaveConference();
    });
    window.addEventListener('pagehide', () => {
      this.leaveConference();
    });
  }

  getConferenceConfiguration = () => {
    return this.originConfiguration;
  };

  getPublisherConfiguration = () => {
    return this.transcoderConfiguration || this.originConfiguration;
  };

  getScreenShareConfiguration = () => {
    return this.originConfiguration;
  };

  setStreamName(name?: string) {
    const animalChoice = lodash.take(lodash.shuffle(Animals));
    this.streamName = name || `${animalChoice}-${String(generateRandomNumber())}`;
  }

  async setTranscoderEndpoint() {
    const transcoderLocation = await requestTranscoder(this.streamName);
    this.transcoderConfiguration = {
      ...configuration,
      app: configuration.proxy,
      connectionParams: {
        host: transcoderLocation.serverAddress,
        app: transcoderLocation.scope,
        ...this.authParams,
      },
    };
  }

  async setOriginEndpoint() {
    const originLocation = await requestOrigin(this.streamName);
    this.originConfiguration = {
      ...configuration,
      app: configuration.proxy,
      connectionParams: {
        host: originLocation.serverAddress,
        app: originLocation.scope,
        ...this.authParams,
      },
    };
  }

  propertyUpdateCallback = (event: any) => {
    const participantKeys = Object.getOwnPropertyNames(event.data);
    participantKeys.forEach((key) => {
      const newData = event.data[key];
      const currentData = this.conferenceConnection.participants[newData.streamName];
      if (currentData && newData.timestamp < currentData.timestamp) return;
      console.log(`[ConferenceItem] Participant ${newData.streamName} new status: ${newData.status}`);
      this.conferenceConnection.participants[newData.streamName] = newData;
      this.conferenceConnection.updateConferenceTime(newData);
    });
    this.onPropertyProcessing();
  };

  async initConference(newRoomName: string | undefined) {
    const housekeeperCallbacks = [
      {
        type: EventTypes.CONNECT_SUCCESS,
        callback: this.connectSuccessCallback,
      },
      {
        type: EventTypes.CONNECT_FAILURE,
        callback: this.connectFailureCallback,
      },
      {
        type: EventTypes.PROPERTY_UPDATE,
        callback: this.propertyUpdateCallback,
      },
    ];
    this.conferenceConnection = new ConferenceItem(this, newRoomName, housekeeperCallbacks);
    await this.conferenceConnection.establishConnection();
    this.joinParticipant(this.participant, Constants.PARTICIPANT_ROLES.LOBBY);
  }

  async initPublisher(mediaConfig: Record<string, unknown>) {
    this.publisherConnection = new PublisherItem(this);
    await this.publisherConnection.initializePublisher(mediaConfig);
  }

  async accessConference(newRoomName: string, role: string, participantNickName: string) {
    try {
      this.setStreamName(participantNickName);
      await this.setOriginEndpoint();
      await this.initConference(newRoomName);
      this.joinParticipant(this.participant, role);
    } catch (e) {
      console.log(e);
    }
  }

  async unpublish() {
    await this.publisherConnection?.unpublish();
  }

  async publish() {
    return this.publisherConnection?.publish();
  }

  async leaveConference() {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    try {
      this.conferenceConnection?.leaveCall(this.participant);
      await this.unpublish();
      await this.stopScreenSharing();
      this.conferenceConnection?.closeConnections();
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.publisherConnection = undefined;
      this.conferenceConnection = undefined;
      this.shuttingDown = false;
    }
  }

  toggleHand(value: boolean) {
    this.conferenceConnection.updateHandStatus(value);
  }

  stopTracks() {
    return this.publisherConnection?.stopPublishingTracks();
  }

  getConferenceStartTime() {
    return this.conferenceConnection?.getStartTime() || 0;
  }

  addPublisherEventCallback(eventType: string, callbackFn: () => void) {
    this.publisherConnection.publisher.on(eventType, callbackFn);
  }

  getCurrentStream() {
    return this.publisherConnection?.publisher?.getMediaStream();
  }

  addHousekeeperMethodUpdateCallback(methodName: string, methodUpdateCallback: (event: any) => void) {
    this.conferenceConnection.addMethodUpdateCallback(methodName, methodUpdateCallback);
  }

  getStreamersList() {
    const streamersList: Array<IStream> = [];
    const allStreamers = this.getParticipantsByRole([Constants.PARTICIPANT_ROLES.STREAMERS]);
    Object.keys(allStreamers).forEach((key: string) => {
      const { action } = allStreamers[key];
      streamersList.push({ streamName: key, action });
    });
    return streamersList;
  }

  getParticipantsList() {
    return this.getParticipantsByRole([Constants.PARTICIPANT_ROLES.VIEWERS, Constants.PARTICIPANT_ROLES.STREAMERS]);
  }

  getParticipantsByRole(roles: string[]) {
    const { participants } = this.conferenceConnection;
    const filteredParticipants: Record<string, IParticipantSharedObjectData> = {};

    Object.keys(participants).forEach((key: string) => {
      const { streamName, status } = participants[key];
      if (roles.includes(status) && this.streamName !== streamName && createIdScreenShare(this.streamName) !== streamName) {
        filteredParticipants[key] = participants[key];
      }
    });

    return filteredParticipants;
  }

  async startCoStreaming(callback: () => void) {
    this.addPublisherEventCallback(this.publisherEvents.PUBLISH_START, callback);
    await this.publish();
  }

  async stopCoStreaming() {
    this.joinParticipant(this.participant, Constants.PARTICIPANT_ROLES.VIEWERS);
    await this.unpublish();
    this.publisherConnection = undefined;
  }

  async startScreenSharing() {
    this.screenShareConnection = new ScreenShare(this);
    await this.screenShareConnection.initializePublisher();
    this.joinParticipant(this.participantScreenShare, Constants.PARTICIPANT_ROLES.STREAMERS);
    const mediaStream = this.screenShareConnection.getStream();
    mediaStream.getVideoTracks().forEach((videoTrack: MediaStreamTrack) => {
      videoTrack.addEventListener('ended', this.endedShareScreenEventCallback);
    });
    return mediaStream;
  }

  async stopScreenSharing() {
    this.joinParticipant(this.participantScreenShare, Constants.PARTICIPANT_ROLES.ENDED);
    await this.screenShareConnection?.unShareScreen();
  }

  joinParticipant(participant: Participant, status: string) {
    participant.setStatus(status);
    this.conferenceConnection?.joinAs({ ...participant });
  }

  addEndedShareScreenEventCallback(callback: () => Promise<void>) {
    this.endedShareScreenEventCallback = callback;
  }

  addConnectionSuccessCallback(callback: () => void) {
    this.connectSuccessCallback = callback;
  }

  addConnectionFailureCallback(callback: () => void) {
    this.connectFailureCallback = callback;
  }

  addPropertyUpdateCallback(callback: () => void) {
    this.onPropertyProcessing = callback;
  }

  setAuthParams(token: string) {
    if (!token) return;
    this.authParams = {
      username: '-',
      password: '-',
      token,
    };
  }
}
