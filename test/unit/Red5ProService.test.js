import red5ProSdkMock from '../mock/red5ProSdk';
import Red5ProService from '../../src/services/Red5ProService';
import Constants from '../../src/assets/utils/Constants';
import Animals from '../../src/assets/utils/Animals';
import ScreenShare from '../../src/services/ScreenShare';

const serverAddress = '10.0.0.1';
const scope = 'live';
const randomNumber = 45;

jest.mock('../../src/services/StreamManager', () => ({
  ...jest.requireActual('../../src/services/StreamManager'),
  requestOrigin: jest.fn().mockReturnValue({
    serverAddress,
    scope,
  }),
  requestTranscoder: jest.fn().mockReturnValue({
    serverAddress,
    scope,
  }),
}));

jest.mock('../../src/services/GeneralService', () => ({
  ...jest.requireActual('../../src/services/GeneralService'),
  generateRandomNumber: jest.fn().mockReturnValue(randomNumber),
}));

describe('Res5ProService layer should', () => {
  const notificationHandler = jest.fn();

  it('New instance should not be null', () => {
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    expect(sut).not.toBeNull();
  });

  const mediaConfig = {
    mediaContraints: {
      audio: true,
      video: true,
    },
  };

  it('Initialize Publisher does not throw', () => {
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    expect(() => {
      sut.initPublisher(mediaConfig);
    }).not.toThrow();
  });

  const createAndInitRed5ProService = () => {
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    sut.initPublisher(mediaConfig);
    return sut;
  };

  it('Publish method calls Publisher Connection method', () => {
    const sut = createAndInitRed5ProService();
    sut.publisherConnection.publish = jest.fn();
    sut.publish();
    expect(sut.publisherConnection.publish.mock.calls.length).toEqual(1);
  });

  it('Unpublish method calls Publisher Connection method', () => {
    const sut = createAndInitRed5ProService();
    sut.publisherConnection.unpublish = jest.fn();
    sut.unpublish();
    expect(sut.publisherConnection.unpublish.mock.calls.length).toEqual(1);
  });

  it('stopTracks method calls Publisher Connection method', () => {
    const sut = createAndInitRed5ProService();
    sut.publisherConnection.stopPublishingTracks = jest.fn();
    sut.stopTracks();
    expect(sut.publisherConnection.stopPublishingTracks.mock.calls.length).toEqual(1);
  });

  const newStreamName = 'newName';
  it('setStreamName method uptades the streamName property', () => {
    const sut = createAndInitRed5ProService();
    sut.setStreamName(newStreamName);
    expect(sut.streamName).toEqual(newStreamName);
  });

  it('setStreamName with no input param should pick an Animal', () => {
    const sut = createAndInitRed5ProService();
    sut.setStreamName();
    const animalRandomlySelected = sut.streamName.replace(`-${randomNumber}`, '');
    const assertion = Animals.includes(animalRandomlySelected);
    expect(assertion).toBe(true);
  });

  it('setOriginEndpoint method sets the proper configuration object', async (done) => {
    const sut = createAndInitRed5ProService();
    sut.setStreamName(newStreamName);
    await sut.setOriginEndpoint();
    expect(sut.originConfiguration.connectionParams.host).toEqual(serverAddress);
    expect(sut.originConfiguration.connectionParams.app).toEqual(scope);
    done();
  });

  it('setTranscoderEndpoint method sets the proper configuration object', async (done) => {
    const sut = createAndInitRed5ProService();
    sut.setStreamName(newStreamName);
    await sut.setTranscoderEndpoint();
    expect(sut.transcoderConfiguration.connectionParams.host).toEqual(serverAddress);
    expect(sut.transcoderConfiguration.connectionParams.app).toEqual(scope);
    done();
  });

  it('accessConference method should call setOriginEndpoint', async (done) => {
    const sut = createAndInitRed5ProService();
    sut.setOriginEndpoint = jest.fn().mockResolvedValue('ok');
    await sut.accessConference(newStreamName);
    expect(sut.setOriginEndpoint).toBeCalled();
    done();
  });

  it('accessConference method should call initConference', async (done) => {
    const sut = createAndInitRed5ProService();
    sut.initConference = jest.fn(() => {
      sut.conferenceConnection = {
        joinAs: jest.fn(),
      };
      sut.conferenceConnection.joinAs();
    });
    await sut.accessConference(newStreamName);
    expect(sut.initConference).toBeCalled();
    expect(sut.conferenceConnection.joinAs).toBeCalled();
    done();
  });

  it('addHousekeeperMethodUpdateCallback method should call conference addMethodUpdateCallback', () => {
    const sut = createAndInitRed5ProService();
    sut.conferenceConnection = {
      addMethodUpdateCallback: jest.fn(),
    };
    sut.addHousekeeperMethodUpdateCallback(newStreamName);
    expect(sut.conferenceConnection.addMethodUpdateCallback).toBeCalled();
  });

  it('getParticipantsList method should get participants but not my own element or people with ended status', () => {
    const sut = createAndInitRed5ProService();
    const participantListNotFiltered = {
      'User-1': { streamName: 'User-1', status: Constants.PARTICIPANT_ROLES.VIEWERS },
      'User-2': { streamName: 'User-2', status: Constants.PARTICIPANT_ROLES.VIEWERS },
      'User-3': { streamName: 'User-3', status: Constants.PARTICIPANT_ROLES.ENDED },
      empty: { streamName: '', status: Constants.PARTICIPANT_ROLES.STREAMERS },
    };
    const participantListFiltered = {
      'User-1': { streamName: 'User-1', status: Constants.PARTICIPANT_ROLES.VIEWERS },
      'User-2': { streamName: 'User-2', status: Constants.PARTICIPANT_ROLES.VIEWERS },
    };
    sut.conferenceConnection = {
      participants: participantListNotFiltered,
    };
    expect(sut.getParticipantsList()).toEqual(participantListFiltered);
  });

  it('startCoStreaming method should call addPublisherEventCallback', async (done) => {
    const sut = createAndInitRed5ProService();
    const callback = () => {};
    sut.setStreamName(newStreamName);
    sut.publish = jest.fn();
    sut.addPublisherEventCallback = jest.fn();
    await sut.startCoStreaming(callback);
    expect(sut.addPublisherEventCallback).toBeCalledWith(sut.publisherEvents.PUBLISH_START, callback);
    done();
  });

  it('startCoStreaming method should call publish', async (done) => {
    const sut = createAndInitRed5ProService();
    sut.setStreamName(newStreamName);
    sut.publish = jest.fn();
    sut.addPublisherEventCallback = jest.fn();
    await sut.startCoStreaming(() => {});
    expect(sut.publish).toBeCalled();
    done();
  });

  it('getStreamersList method should get participants key and action of those who are STREAMERS', () => {
    const sut = createAndInitRed5ProService();
    const participantListNotFiltered = {
      'User-1': { streamName: 'User-1', status: Constants.PARTICIPANT_ROLES.STREAMERS, action: Constants.STREAM_ACTIONS.PUBLISH },
      'User-2': { streamName: 'User-2', status: Constants.PARTICIPANT_ROLES.STREAMERS, action: Constants.STREAM_ACTIONS.SCREEN_SHARE },
      'User-3': { streamName: 'User-3', status: Constants.PARTICIPANT_ROLES.ENDED, action: Constants.STREAM_ACTIONS.PUBLISH },
      'User-4': { streamName: 'User-4', status: Constants.PARTICIPANT_ROLES.VIEWERS, action: Constants.STREAM_ACTIONS.PUBLISH },
    };
    const participantListFiltered = [
      { streamName: 'User-1', action: Constants.STREAM_ACTIONS.PUBLISH },
      { streamName: 'User-2', action: Constants.STREAM_ACTIONS.SCREEN_SHARE },
    ];
    sut.conferenceConnection = {
      participants: participantListNotFiltered,
    };
    expect(sut.getStreamersList()).toEqual(participantListFiltered);
  });

  it('getParticipantsByRole method should get participants filering them by role', () => {
    const sut = createAndInitRed5ProService();
    const participantListNotFiltered = {
      'User-1': { streamName: 'User-1', status: Constants.PARTICIPANT_ROLES.STREAMERS },
      'User-2': { streamName: 'User-2', status: Constants.PARTICIPANT_ROLES.ENDED },
      'User-3': { streamName: 'User-3', status: Constants.PARTICIPANT_ROLES.VIEWERS },
    };
    const participantListFiltered = {
      'User-1': { streamName: 'User-1', status: Constants.PARTICIPANT_ROLES.STREAMERS },
    };
    sut.conferenceConnection = {
      participants: participantListNotFiltered,
    };
    expect(sut.getParticipantsByRole(Constants.PARTICIPANT_ROLES.STREAMERS)).toEqual(participantListFiltered);
  });

  const stopCostreamingScenario = () => {
    const sut = createAndInitRed5ProService();
    sut.setStreamName(newStreamName);
    sut.participant.setStatus = jest.fn();
    sut.conferenceConnection = { joinAs: jest.fn() };
    sut.unpublish = jest.fn();
    return sut;
  };

  it('stopCoStreaming should invoke setStatus', async (done) => {
    const sut = stopCostreamingScenario();
    await sut.stopCoStreaming();
    expect(sut.participant.setStatus).toBeCalledWith(Constants.PARTICIPANT_ROLES.VIEWERS);
    done();
  });

  it('stopCoStreaming should invoke joinAs', async (done) => {
    const sut = stopCostreamingScenario();
    await sut.stopCoStreaming();
    expect(sut.conferenceConnection.joinAs).toBeCalledWith(sut.participant);
    done();
  });

  it('stopCoStreaming should invoke unpublish', async (done) => {
    const sut = stopCostreamingScenario();
    await sut.stopCoStreaming();
    expect(sut.unpublish).toBeCalled();
    done();
  });

  it('startScreenSharing should instance an ScreenShare object class', async (done) => {
    navigator.mediaDevices = { getDisplayMedia: jest.fn().mockResolvedValue(true) };
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    sut.joinParticipant = jest.fn();
    await sut.startScreenSharing();
    expect(sut.screenShareConnection).toBeInstanceOf(ScreenShare);
    done();
  });

  it('startScreenSharing should join the screen with STREAMER status', async (done) => {
    navigator.mediaDevices = { getDisplayMedia: jest.fn().mockResolvedValue(true) };
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    sut.joinParticipant = jest.fn();
    await sut.startScreenSharing();
    expect(sut.joinParticipant).toHaveBeenCalledWith(sut.participantScreenShare, Constants.PARTICIPANT_ROLES.STREAMERS);
    done();
  });

  it('stopScreenSharing should call joinParticipant with ENDED status', async (done) => {
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    sut.joinParticipant = jest.fn();
    await sut.stopScreenSharing();
    expect(sut.joinParticipant).toHaveBeenCalledWith(sut.participantScreenShare, Constants.PARTICIPANT_ROLES.ENDED);
    done();
  });

  it('joinParticipant should call joinAs with updated participant status', () => {
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    const statusUnderTest = Constants.PARTICIPANT_ROLES.ENDED;
    sut.conferenceConnection = {
      joinAs: jest.fn(),
    };
    sut.joinParticipant(sut.participant, statusUnderTest);
    expect(sut.participant.status).toEqual(statusUnderTest);
    expect(sut.conferenceConnection.joinAs).toHaveBeenCalledWith(sut.participant);
  });

  it('propertyUpdateCallback should call onPropertyProcessing method', () => {
    const event = {
      data: {},
    };
    const sut = new Red5ProService(notificationHandler, red5ProSdkMock);
    sut.onPropertyProcessing = jest.fn();
    sut.propertyUpdateCallback(event);
    expect(sut.onPropertyProcessing).toBeCalled();
  });
});
