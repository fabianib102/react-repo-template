import slugify from 'slugify';
import Constants from '../assets/utils/Constants';

export const getAudioInputDevices = async () => {
  return getDevice('audioinput');
};

export const getVideoDevices = async () => {
  return getDevice('videoinput');
};

export const getAudioOutputDevices = async () => {
  return getDevice('audiooutput');
};

export const mediaDevicesAreAllowed = async () => {
  try {
    const device = {
      audio: true,
      video: {
        height: Constants.UHDV.h,
        width: Constants.UHDV.w,
      },
    };
    const userMedia = await navigator.mediaDevices.getUserMedia(device);
    userMedia.getTracks().forEach((userMediaTrack: any) => {
      userMediaTrack.stop();
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getDevice = async (type: string) => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((item) => {
      return item.kind.toLowerCase() === type;
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateId = (name: string, hasAbr: boolean) => {
  const ending = hasAbr ? '_1' : '';
  return `${slugify(name).toLowerCase()}${ending}`;
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  return new Intl.DateTimeFormat('fr-ca', options).format(currentDate);
};

export const formatHHMMSS = (timestamp: number) => {
  const zeroFill = (n: number) => {
    if (n > 9) return n;
    return `0${n}`;
  };
  const totalSeconds = Math.floor(timestamp / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;
  return `${hours}:${zeroFill(minutes)}:${zeroFill(seconds)}`;
};

export const createIdScreenShare = (stream: string) => {
  return `${stream}-screen-share`;
};

export const generateRandomNumber = () => {
  const array = new Uint16Array(1);
  window.crypto.getRandomValues(array); // Compliant for security-sensitive use cases
  return array[0];
};

export const addVideoContainer = () => {
  const videoElement = document.createElement('video');
  videoElement.id = 'red5pro-publisher';
  videoElement.setAttribute('style', 'display:none');
  document.body.appendChild(videoElement);
};

export const removeVideoContainer = () => {
  const videoElementToRemove = document.querySelector('#red5pro-publisher');
  videoElementToRemove?.parentNode?.removeChild(videoElementToRemove);
};
