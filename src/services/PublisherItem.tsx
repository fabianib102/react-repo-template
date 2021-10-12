import Constants from '../assets/utils/Constants';

class PublisherItem {
  red5ProSdk: any;
  publisher: any;
  streamName: any;
  configuration: any;
  loggerEvent: any;
  constraintsRejectedEvent: any;
  connectionClosedEvent: any;
  mediaStreamAvailableEvent: any;
  sendNotification: any;

  constructor(red5ProService: any) {
    this.red5ProSdk = red5ProService.red5ProSdk;
    this.publisher = undefined;
    this.streamName = red5ProService.streamName;
    this.loggerEvent = this.logger.bind(this);
    this.constraintsRejectedEvent = this.constraintsRejected.bind(this);
    this.mediaStreamAvailableEvent = this.mediaStreamAvailable.bind(this);
    this.connectionClosedEvent = this.connectionClosed.bind(this);
    this.sendNotification = red5ProService.sendNotification;
    this.configuration = red5ProService.getPublisherConfiguration();
  }

  async initializePublisher(mediaConfig: Record<string, unknown>) {
    this.publisher = new this.red5ProSdk.RTCPublisher();
    try {
      this.configuration = {
        ...this.configuration,
        ...mediaConfig,
        streamName: this.streamName,
      };
      this.publisherEventCallbacks('on');
      await this.publisher.init(this.configuration);
    } catch (err: any) {
      console.log(err);
    }
  }

  publisherEventCallbacks(action: string) {
    const { PublisherEventTypes, RTCPublisherEventTypes } = this.red5ProSdk;
    this.publisher[action]('*', this.loggerEvent);
    this.publisher[action](RTCPublisherEventTypes.CONSTRAINTS_REJECTED, this.constraintsRejectedEvent);
    this.publisher[action](RTCPublisherEventTypes.MEDIA_STREAM_AVAILABLE, this.mediaStreamAvailableEvent);
    this.publisher[action](PublisherEventTypes.CONNECTION_CLOSED, this.connectionClosedEvent);
  }

  logger(event: any) {
    console.log(`[Red5ProPublisher: ${this.streamName}] ${event.type}`);
  }

  mediaStreamAvailable() {
    const videoTrack = this.publisher.getMediaStream().getVideoTracks()[0];
    const selectedCapabilities = {
      device: videoTrack.label,
      width: videoTrack.getConstraints().width.exact,
      height: videoTrack.getConstraints().height.exact,
    };
    this.sendNotification({ show: true, message: Constants.MEDIA_DEVICES_SELECTED(selectedCapabilities), type: Constants.SUCCESS });
  }

  constraintsRejected() {
    this.sendNotification({
      show: true,
      message: Constants.MEDIA_DEVICES_RESOLUTION_ERROR(this.configuration.mediaConstraints.video),
      type: Constants.ERROR,
    });
  }

  connectionClosed(event: any) {
    console.log(`[Red5ProPublisher: ${this.streamName}] ${event.type}`);
  }

  unpublish: any = async () => {
    this.stopPublishingTracks();
    await this.publisher?.unpublish();
    this.publisherEventCallbacks('off');
  };

  publish: any = async () => {
    await this.publisher.publish();
  };

  stopPublishingTracks() {
    this.publisher
      ?.getMediaStream()
      ?.getVideoTracks()
      ?.forEach((videoTrack: any) => {
        videoTrack.stop();
      });
    this.publisher
      ?.getMediaStream()
      ?.getAudioTracks()
      ?.forEach((audioTrack: any) => {
        audioTrack.stop();
      });
  }
}

export default PublisherItem;
