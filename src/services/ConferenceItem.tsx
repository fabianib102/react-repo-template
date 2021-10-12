import { Housekeeper, EventTypes } from '@southworks/custom-shared-object-client';
import Constants from '../assets/utils/Constants';
import Participant, { IAdditionalData } from './Participant';
import { ISharedObjectEventWithCallback, IRed5ProService, IParticipantSharedObjectData } from '../assets/utils/Interfaces';
import { createIdScreenShare } from './GeneralService';

class ConferenceItem {
  red5ProService: IRed5ProService;
  streamName: string;
  roomName: string | undefined;
  configuration: any;
  participants: Record<string, IParticipantSharedObjectData>;
  sharedObject: Housekeeper | undefined;
  startTime: number | undefined;
  housekeeperCallbacks: Array<ISharedObjectEventWithCallback>;

  constructor(red5ProService: IRed5ProService, roomName: string | undefined, callbacks: Array<ISharedObjectEventWithCallback>) {
    this.red5ProService = red5ProService;
    this.streamName = red5ProService.streamName;
    this.roomName = roomName;
    this.configuration = { ...this.red5ProService.getConferenceConfiguration() };
    this.configuration.connectionParams = {
      host: this.configuration.connectionParams.host,
      app: this.configuration.connectionParams.app,
    };
    this.participants = {};
    this.sharedObject = undefined;
    this.startTime = undefined;
    this.housekeeperCallbacks = callbacks;
  }

  setEventCallbacks(eventArray: Array<ISharedObjectEventWithCallback>) {
    eventArray.forEach((event) => {
      this.sharedObject?.on(event.type, event.callback);
    });
  }

  async establishConnection() {
    try {
      this.sharedObject = new Housekeeper(process.env.REACT_APP_SHARED_OBJECT_ENDPOINT as string, this.roomName as string);
      this.setEventCallbacks(this.housekeeperCallbacks);
      await this.sharedObject.open();
    } catch (e) {
      console.log(e);
    }
  }

  static shouldUpdateTime(role: string | undefined) {
    return role !== Constants.PARTICIPANT_ROLES.LOBBY;
  }

  getStartTime() {
    return this.participants[this.streamName]?.startTime || 0;
  }

  updateConferenceTime(participant: IParticipantSharedObjectData) {
    if (!ConferenceItem.shouldUpdateTime(participant.status)) return;
    if (!this.participants[this.streamName]) return;
    if (!this.participants[this.streamName].startTime || participant.startTime < this.participants[this.streamName].startTime) {
      this.participants[this.streamName].startTime = participant.startTime;
      this.sharedObject?.setProperty(this.participants[this.streamName]);
    }
    console.log(`[Conference - Participant in SharedObject] Start Time @ ${this.participants[this.streamName].startTime}`);
  }

  joinAs(participantInfo: Participant) {
    const { status, additionalData, action } = participantInfo;
    const timestamp = Date.now();
    const startTime = ConferenceItem.shouldUpdateTime(status) ? this.participants[this.streamName]?.startTime || timestamp : 0;
    const participantData = {
      startTime,
      timestamp,
      streamName: this.streamName,
      status,
      action,
      additionalData,
    };

    let id;
    if (action === Constants.STREAM_ACTIONS.SCREEN_SHARE) {
      id = createIdScreenShare(this.streamName);
      participantData.streamName = id;
    } else {
      id = this.streamName;
    }
    this.participants[id] = participantData;
    this.sharedObject?.setProperty(participantData);
  }

  leaveCall(participant: Participant) {
    this.joinAs({ ...participant, status: Constants.PARTICIPANT_ROLES.ENDED } as Participant);
  }

  closeConnections() {
    this.sharedObject?.close();
    this.sharedObject = undefined;
  }

  invokeMethodUpdate(methodName: string, data?: any) {
    this.sharedObject?.send(methodName, data);
  }

  addMethodUpdateCallback(methodName: string, methodUpdateCallback: (event: any) => void) {
    this.sharedObject?.on(EventTypes.METHOD_UPDATE, (event: any) => {
      if (event.data.methodName === methodName) {
        methodUpdateCallback(event);
      }
    });
  }

  async updateParticipantAdditionalData(additionalData: IAdditionalData) {
    this.participants[this.streamName].additionalData = additionalData;
    this.participants[this.streamName].timestamp = Date.now();
    await this.sharedObject?.setProperty(this.participants[this.streamName]);
  }
}

export default ConferenceItem;
