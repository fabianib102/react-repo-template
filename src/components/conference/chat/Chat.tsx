import React, { FC } from 'react';
import Row from 'react-bootstrap/Row';
import SubComponentHeader from '../SubComponentHeader';
import Constants from '../../../assets/utils/Constants';
import '../../../assets/css/Styles.scss';
import '../../../assets/css/ChatStyles.scss';

interface Props {
  streamName: string;
  showHeader: boolean;
  height: string;
  headerClassName?: string;
  nickName: string;
}

const Chat: FC<Props> = (props: Props) => {
  return (
    <>
      <SubComponentHeader title={Constants.CHAT_ROOM} showHeader={props.showHeader} className={props.headerClassName} />
      <Row className="row-sub-header" style={{ height: props.height }}>
        <iframe
          title="chat"
          className="w-100 h-100 min-h-400"
          frameBorder="0"
          src={
            `${process.env.REACT_APP_EMBEDDABLE_PLAYER_URL}/${Constants.CHAT_PATH}` +
            '/' +
            `${Constants.QUERY}${props.streamName}&${Constants.NICKNAME_QUERY}${props.nickName}`
          }
        />
      </Row>
    </>
  );
};

Chat.defaultProps = {
  headerClassName: '',
};

export default Chat;
