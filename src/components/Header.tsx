import React, { FC } from 'react';
import '../assets/css/Header.scss';
import { Link, useLocation } from 'react-router-dom';
import Logout from './Logout';
import logo from '../assets/images/ull_logo.png';
import Constants from '../assets/utils/Constants';

interface Props {
  title: string;
}

const Header: FC<Props> = (props: Props) => {
  const location = useLocation().pathname;
  const isConsumerApp = location.includes(Constants.CONFERENCE_PATH) || location.includes(Constants.CONSUMER_APP_PATH);
  const isLogin = location.includes(Constants.LOGIN_PATH);

  const { title } = props;
  return (
    <div className="page-header">
      <div className="logo">
        <Link to={isConsumerApp ? `/${Constants.CONSUMER_APP_PATH}` : `/`}>
          <img src={logo} alt="ULL Logo" />
        </Link>
      </div>
      <div className="title">{title}</div>
      <div className="logout">{isLogin || isConsumerApp ? null : <Logout />}</div>
    </div>
  );
};

export default Header;
