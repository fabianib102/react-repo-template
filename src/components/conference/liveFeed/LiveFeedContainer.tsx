import React, { FC, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import SubComponentHeader from '../SubComponentHeader';
import Constants from '../../../assets/utils/Constants';
import '../../../assets/css/LiveFeedContainerStyles.scss';
import LiveFeed from './LiveFeed';
import { IOwnResource, IStream } from '../../../assets/utils/Interfaces';

interface Props {
  videoSource: Array<IOwnResource>;
  streamList: Array<IStream>;
  showHeader: boolean;
  liveFeedOverrideStyles: Record<string, unknown>;
}

interface Feed {
  type: string;
  src: string | MediaStream;
  key: string;
}

const LiveFeedContainer: FC<Props> = (props: Props) => {
  const [feeds, setFeeds] = useState<Array<Feed>>([]);

  useEffect(() => {
    const feedsToSubscribe = props.streamList.map((stream: IStream) => {
      return {
        type: Constants.SUBSCRIBER,
        src: stream.streamName,
        key: stream.action === Constants.STREAM_ACTIONS.SCREEN_SHARE ? Constants.SCREEN_SHARE_PUBLISHER : `${stream.streamName}-pub`,
      };
    });
    const ownFeeds = props.videoSource.map((ownResource: IOwnResource) => {
      return {
        type: Constants.PUBLISHER,
        src: ownResource.mediaStream,
        key: ownResource.id,
      };
    });
    const feedList = [...feedsToSubscribe, ...ownFeeds];
    feedList.sort((feed: Feed) => {
      if (feed.key === Constants.SCREEN_SHARE_PUBLISHER) return -1;
      return 0;
    });
    setFeeds(feedList);
  }, [props.streamList, props.videoSource]);

  return (
    <>
      <SubComponentHeader title="Live Feed" showHeader={props.showHeader} />
      <Row className="row-sub-header live-feed-container justify-content-center" style={props.liveFeedOverrideStyles}>
        {feeds.length !== 0 ? (
          feeds.map((feed) => <LiveFeed id={feed.key} key={feed.key} src={feed.src} type={feed.type} />)
        ) : (
          <div className="offline-message-container">{Constants.OFFLINE_STREAMING_MESSAGE}</div>
        )}
      </Row>
    </>
  );
};

export default LiveFeedContainer;
