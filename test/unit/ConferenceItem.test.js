/* eslint-disable no-underscore-dangle */
import { Housekeeper, EventTypes } from '@southworks/custom-shared-object-client';
import ConferenceItem from '../../src/services/ConferenceItem';
import red5ProSdkMock from '../mock/red5ProSdk';
import { configuration } from '../../src/services/red5pro.config';
import Participant from '../../src/services/Participant';
import Constants from '../../src/assets/utils/Constants';

describe('ConferenceItem service layer', () => {
  const channelId = 'channel-id';
  const housekeeperCallbacks = [
    {
      type: EventTypes.CONNECT_SUCCESS,
      callback: () => {},
    },
    {
      type: EventTypes.CONNECT_FAILURE,
      callback: () => {},
    },
    {
      type: EventTypes.PROPERTY_UPDATE,
      callback: () => {},
    },
    {
      type: EventTypes.METHOD_UPDATE,
      callback: () => {},
    },
  ];

  const createConferenceItem = () => {
    return new ConferenceItem(
      {
        red5ProSdk: red5ProSdkMock,
        streamName: 'publisher-id',
        getConferenceConfiguration() {
          return {
            ...configuration,
            connectionParams: {
              host: 'fakeHost',
              app: 'fakeApp',
            },
          };
        },
      },
      channelId,
      housekeeperCallbacks
    );
  };

  const initConferenceItem = async () => {
    const item = createConferenceItem();
    await item.establishConnection();
    return item;
  };

  const initAndJoinParticipant = async (status) => {
    const conference = await initConferenceItem();
    const participantData = new Participant(Constants.STREAM_ACTIONS.PUBLISH);
    participantData.setStatus(status);
    conference.joinAs(participantData);
    return conference;
  };

  beforeEach(() => {
    Housekeeper.prototype.open = jest.fn();
    Housekeeper.prototype.on = jest.fn();
    Housekeeper.prototype.sendMessage = jest.fn();
  });

  it('New instance should not be null', async () => {
    expect(createConferenceItem).not.toBeNull();
  });

  it('setEventCallbacks should add proper method', async (done) => {
    const conference = await initConferenceItem();
    expect(conference.sharedObject.on).toBeCalledTimes(housekeeperCallbacks.length);
    done();
  });

  it('Join participant in lobby should update participants list', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.LOBBY);
    expect(conference.participants[conference.streamName]).not.toBeUndefined();
    done();
  });

  it('Join participant should set participant properties its own element', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.LOBBY);
    expect(conference.participants[conference.streamName].timestamp).not.toBeUndefined();
    expect(conference.participants[conference.streamName].streamName).toEqual(conference.streamName);
    done();
  });

  it('Join participant in LOBBY should set correct role for participant', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.LOBBY);
    expect(conference.participants[conference.streamName].status).toEqual(Constants.PARTICIPANT_ROLES.LOBBY);
    done();
  });

  it('Join participant as STREAMER should set correct role for participant', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.STREAMERS);
    expect(conference.participants[conference.streamName].status).toEqual(Constants.PARTICIPANT_ROLES.STREAMERS);
    done();
  });

  it('Join participant as VIEWER should set correct role for participant', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.VIEWERS);
    expect(conference.participants[conference.streamName].status).toEqual(Constants.PARTICIPANT_ROLES.VIEWERS);
    done();
  });

  it('Method shouldUpdateTime should return false if it receives the lobby value', async (done) => {
    expect(ConferenceItem.shouldUpdateTime(Constants.PARTICIPANT_ROLES.LOBBY)).toEqual(false);
    done();
  });

  it('Method shouldUpdateTime should return true if it receives a value that is not lobby', async (done) => {
    expect(ConferenceItem.shouldUpdateTime(Constants.PARTICIPANT_ROLES.STREAMERS)).toEqual(true);
    done();
  });

  it('End call for participant (joining as ended) should set correct role for participant', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.ENDED);
    expect(conference.participants[conference.streamName].status).toEqual(Constants.PARTICIPANT_ROLES.ENDED);
    done();
  });

  const participantInfo = {
    streamName: 'new-participant-id',
    status: Constants.PARTICIPANT_ROLES.STREAMERS,
  };

  it('Method updateConferenceTime should set startTime if undefined', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.LOBBY);
    const timestamp = Date.now();
    participantInfo.startTime = timestamp;
    conference.participants['publisher-id'].startTime = undefined;
    conference.updateConferenceTime(participantInfo);
    expect(conference.participants['publisher-id'].startTime).toEqual(timestamp);
    done();
  });

  it('Method updateConferenceTime should not change if new participant is at Lobby', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.LOBBY);
    const timestamp = Date.now();
    participantInfo.status = Constants.PARTICIPANT_ROLES.LOBBY;
    participantInfo.startTime = 0;
    conference.participants['publisher-id'].startTime = timestamp;
    conference.updateConferenceTime(participantInfo);
    expect(conference.participants['publisher-id'].startTime).toEqual(timestamp);
    done();
  });

  it('Method updateConferenceTime should update if I recieve and older registration', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.LOBBY);
    const timestamp = Date.now();
    participantInfo.status = Constants.PARTICIPANT_ROLES.STREAMERS;
    participantInfo.startTime = timestamp;
    conference.participants['publisher-id'].startTime = timestamp + 10;
    conference.updateConferenceTime(participantInfo);
    expect(conference.participants['publisher-id'].startTime).toEqual(timestamp);
    done();
  });

  it('Method closeConnection should invoke close on socket and shared object', async (done) => {
    const conference = await initConferenceItem();
    const sharedObjectCloseMockRef = jest.fn();
    conference.sharedObject.close = sharedObjectCloseMockRef;
    conference.closeConnections();
    expect(sharedObjectCloseMockRef).toBeCalled();
    done();
  });

  it('addMethodUpdateCallback should attach an event to the shared object', async (done) => {
    const conference = await initConferenceItem();
    conference.addMethodUpdateCallback('name', jest.fn());
    expect(conference.sharedObject.on).toBeCalled();
    done();
  });

  it('updateParticipantAdditionalData should update participant data', async (done) => {
    const conference = await initAndJoinParticipant(Constants.PARTICIPANT_ROLES.LOBBY);
    const additionalData = { askedToJoin: true };
    expect(conference.participants[conference.streamName].additionalData.askedToJoin).toBe(false);
    conference.updateParticipantAdditionalData(additionalData);
    expect(conference.participants[conference.streamName].additionalData.askedToJoin).toBe(true);
    done();
  });
});
