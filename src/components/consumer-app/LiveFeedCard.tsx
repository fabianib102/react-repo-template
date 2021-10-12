import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Channel } from '../../models/Channel';
import randomImage from '../../assets/images/camera-icon.jpg';
import Constants from '../../assets/utils/Constants';
import '../../assets/css/consumer-app/LiveFeedCard.scss';

interface Props {
  channel: Channel;
}

const LiveFeedCard: FC<Props> = ({ channel }) => {
  const history = useHistory();
  const joinLiveFeed = async () => {
    history.push(`/${Constants.CONFERENCE_PATH}/${channel.id}`);
  };

  const getChannelStatus = () => {
    let channelStatus;
    if (channel.channelStatus === Constants.STATUS.ONLINE) {
      channelStatus = Constants.STATUS.Live.toUpperCase();
    } else {
      channelStatus = channel.channelStatus.toUpperCase();
    }
    return channelStatus;
  };

  return (
    <Card className="livefeed-card" onClick={() => joinLiveFeed()}>
      <span className={`channel-status ${channel.channelStatus}`}>{getChannelStatus()}</span>
      <Card.Img variant="top" src={randomImage} className="card-image" />
      <Card.Body className="card-body">
        <Card.Title className="title">{channel.channelName}</Card.Title>
        <Card.Text className="extra-info">{`User-${channel.createdOn}`}</Card.Text>
        <Card.Text className="extra-info">{`${channel.createdOn.toString().substring(channel.createdOn.toString().length - 3)} viewers`}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default LiveFeedCard;
