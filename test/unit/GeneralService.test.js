import slugify from 'slugify';
import { isArray } from 'lodash';
import {
  generateId,
  getCurrentDate,
  addVideoContainer,
  removeVideoContainer,
  formatHHMMSS,
  getAudioInputDevices,
  getVideoDevices,
} from '../../src/services/GeneralService';

describe('GeneralService service layer should', () => {
  const streamName = 'channel Name';

  const audioDevice = {
    deviceId: '234',
    groupId: 'groupId',
    kind: 'audioinput',
  };

  const videoDevice = {
    deviceId: '566',
    groupId: 'groupId',
    kind: 'videoinput',
  };

  const mockDevices = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enumerateDevices: jest.fn().mockImplementation((_) => Promise.resolve([videoDevice, audioDevice])),
  };

  const mockFailEnumerateDevices = () => {
    return {
      // eslint-disable-next-line prefer-promise-reject-errors, @typescript-eslint/no-unused-vars
      enumerateDevices: jest.fn().mockImplementation((_) => Promise.reject('no media detected')),
    };
  };

  beforeEach(() => {
    global.document.body.innerHTML = '<div></div>';
  });

  afterEach(() => {
    global.document.body.innerHTML = '<div></div>';
  });

  it('Method generateId should generate correct Id if ABR is not enabled', async () => {
    const sut = generateId(streamName, false);
    expect(sut).toEqual(slugify(streamName).toLowerCase());
  });

  it("Method generateId should append '_1' to Id if ABR is enabled", async () => {
    const sut = generateId(streamName, true);
    expect(sut).toEqual(`${slugify(streamName).toLowerCase()}_1`);
  });

  it('Method getCurrentDate should return the current date in international format', async () => {
    const dateNow = new Date();
    const yearNow = new Intl.DateTimeFormat('fr-ca', { year: 'numeric' }).format(dateNow);
    const monthNow = new Intl.DateTimeFormat('fr-ca', { month: '2-digit' }).format(dateNow);
    const dayNow = new Intl.DateTimeFormat('fr-ca', { day: '2-digit' }).format(dateNow);

    const currentDate = getCurrentDate();
    expect(currentDate).toEqual(`${yearNow}-${monthNow}-${dayNow}`);
  });

  it('Method addVideoContainer should add a video element to DOM', () => {
    addVideoContainer();
    const sut = document.querySelector('#red5pro-publisher');
    expect(sut).not.toBeUndefined();
    expect(sut.style.display).toEqual('none');
  });

  it('Method removeVideoContainer remove a video element from DOM', () => {
    addVideoContainer();
    removeVideoContainer();
    const sut = document.querySelector('#red5pro-publisher');
    expect(sut).toBeNull();
  });

  it('Method formatHHMMSS should format the time as [H]H:MM:SS', () => {
    const timestamp = 0;
    const sut = formatHHMMSS(timestamp);
    expect(sut).toEqual('0:00:00');
  });

  it('getAudioInputDevices returns an array of input devices', async (done) => {
    global.navigator.mediaDevices = mockDevices;
    const mics = await getAudioInputDevices();
    expect(isArray(mics)).toBe(true);
    expect(mics[0].deviceId).toEqual(audioDevice.deviceId);
    done();
  });

  it('getInputAudioDevices returns an empty list if enumerateDevices fails', async (done) => {
    const mockedDevices = mockFailEnumerateDevices();
    global.navigator.mediaDevices = mockedDevices;
    const mics = await getAudioInputDevices();
    expect(isArray(mics)).toBe(true);
    expect(mics.length).toEqual(0);
    done();
  });

  it('getVideoDevices returns an array of video devices', async (done) => {
    global.navigator.mediaDevices = mockDevices;
    const camera = await getVideoDevices();
    expect(isArray(camera)).toBe(true);
    expect(camera[0].deviceId).toEqual(videoDevice.deviceId);
    done();
  });

  it('getVideoDevices returns an empty list if enumerateDevices fails', async (done) => {
    const mockedDevices = mockFailEnumerateDevices();
    global.navigator.mediaDevices = mockedDevices;
    const camera = await getAudioInputDevices();
    expect(camera.length).toEqual(0);
    done();
  });
});
