import React, { FC, useRef, useEffect } from 'react';
import '../../../assets/css/LiveFeed.scss';
import { Red5ProSubscriber } from '@southworks/red5pro-player';
import Constants from '../../../assets/utils/Constants';

interface Props {
  id: string;
  type: string;
  src: MediaStream | string;
}

const LiveFeed: FC<Props> = (props: Props) => {
  const videoRef = useRef(null) as any;
  const subscriberCredentials = Constants.SUBSCRIBER_CREDENTIALS;
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = props.src as MediaStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef]);

  const renderElement = () => {
    if (props.type === Constants.PUBLISHER) {
      return <video id={props.id} ref={videoRef} autoPlay playsInline muted className="live-feed" />;
    }
    return (
      <Red5ProSubscriber
        streamName={props.src as string}
        host={process.env.REACT_APP_STREAM_MANAGER_URL as string}
        id={props.id}
        className="live-feed"
        controls
        autoPlay
        contain={!!(props.id === Constants.SCREEN_SHARE_PUBLISHER)}
        useAuth
        authParams={subscriberCredentials}
      />
    );
  };

  return renderElement();
};

export default LiveFeed;
