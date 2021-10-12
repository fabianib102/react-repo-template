import ScreenShare from '../../src/services/ScreenShare';
import red5ProSdkMock from '../mock/red5ProSdk';
import { configuration } from '../../src/services/red5pro.config';
import Constants from '../../src/assets/utils/Constants';
import { addVideoContainer, removeVideoContainer } from '../../src/services/GeneralService';

jest.mock('../../src/services/GeneralService', () => ({
  ...jest.requireActual('../../src/services/GeneralService'),
  addVideoContainer: jest.fn(),
  removeVideoContainer: jest.fn(),
}));

describe('ScreenShare service layer', () => {
  const publisherId = 'publisher-id';
  const red5ProServiceMock = {
    red5ProSdk: red5ProSdkMock,
    getPublisherConfiguration: () => {
      return configuration;
    },
    getScreenShareConfiguration: () => {
      return configuration;
    },
    streamName: publisherId,
  };

  const createShareScreen = () => {
    return new ScreenShare(red5ProServiceMock);
  };

  const startScreenSharing = async () => {
    const shareScreenInstance = new ScreenShare(red5ProServiceMock);
    await shareScreenInstance.initializePublisher();
    return shareScreenInstance;
  };

  it('New instance should match type ScreenShare', () => {
    const sut = createShareScreen();
    expect(sut).toBeInstanceOf(ScreenShare);
  });

  it("screenShareConfig should have streamName equal to 'screen-share'", () => {
    const sut = createShareScreen();
    expect(sut.screenShareConfig.streamName).toEqual(`${publisherId}-${Constants.SCREEN_SHARE_PUBLISHER}`);
  });

  it('screenShareConfig should set media constraints to video: true and audio: false', () => {
    const sut = createShareScreen();
    expect(sut.screenShareConfig.mediaConstraints.video).toEqual(true);
    expect(sut.screenShareConfig.mediaConstraints.audio).toEqual(false);
  });

  it('initializePublisher should get the MediaStream and call publish method', async (done) => {
    const getDisplayMediaMock = jest.fn().mockResolvedValue(true);
    navigator.mediaDevices = { getDisplayMedia: getDisplayMediaMock };
    const sut = createShareScreen();
    sut.publish = jest.fn().mockResolvedValue(true);
    await sut.initializePublisher();
    expect(sut.publish).toBeCalled();
    done();
  });

  it('publish should call addVideoContainer and removeVideoContainer methods', async (done) => {
    const sut = createShareScreen();
    await sut.publish();
    expect(addVideoContainer).toBeCalled();
    expect(removeVideoContainer).toBeCalled();
    done();
  });

  it('stop screen sharing should call stopVideoTracks and unpublish methods', async (done) => {
    const sut = await startScreenSharing();
    sut.publisher.unpublish = jest.fn();
    sut.stopVideoTracks = jest.fn();
    await sut.unShareScreen();
    expect(sut.publisher.unpublish).toBeCalled();
    expect(sut.stopVideoTracks).toBeCalled();
    done();
  });

  it('StopVideoTracks should invoke method stop', async (done) => {
    const sut = await startScreenSharing();
    const stopMock = jest.fn();
    for (let i = 0; i < sut.publisher.currentTracks.length; i += 1) {
      sut.publisher.currentTracks[i].stop = stopMock;
    }
    sut.stopVideoTracks();
    expect(stopMock).toBeCalledTimes(1);
    done();
  });
});
