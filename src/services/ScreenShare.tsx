import PublisherItem from './PublisherItem';
import { addVideoContainer, removeVideoContainer, createIdScreenShare } from './GeneralService';

// Recomended Solution according to following issue:
// https://github.com/microsoft/TypeScript/issues/33232
declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }
}

class ShareScreen extends PublisherItem {
  screenShareConfig: any;
  constructor(red5ProService: any) {
    super(red5ProService);
    this.screenShareConfig = {
      ...red5ProService.getScreenShareConfiguration(),
      mediaConstraints: {
        audio: false,
        video: true,
      },
      streamName: createIdScreenShare(this.streamName),
    };
  }

  async initializePublisher() {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia(this.screenShareConfig);
    await this.publish(mediaStream);
  }

  publish: any = async (mediaStream: MediaStream) => {
    this.publisher = await new this.red5ProSdk.RTCPublisher();
    try {
      addVideoContainer();
      await this.publisher.initWithStream(this.screenShareConfig, mediaStream);
    } catch (e) {
      console.log(e);
    } finally {
      removeVideoContainer();
    }
    return this.publisher.publish();
  };

  getStream() {
    return this.publisher?.getMediaStream() || undefined;
  }

  async unShareScreen() {
    try {
      this.stopVideoTracks();
      await this.publisher.unpublish();
    } catch (e) {
      console.log(e);
    }
  }

  stopVideoTracks() {
    this.publisher
      .getMediaStream()
      .getVideoTracks()
      .forEach((videoTrack: MediaStreamTrack) => {
        videoTrack.stop();
      });
  }
}

export default ShareScreen;
