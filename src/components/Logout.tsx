import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';
import { FaSignOutAlt } from 'react-icons/fa';
import { Auth } from 'aws-amplify';
import { useLoader } from '../context/LoaderContext';
import '../assets/css/Logout.scss';
import '../assets/css/Styles.scss';

const Logout: FC = () => {
  const { setIsLoading } = useLoader();

  const DoLogout = () => {
    setIsLoading(true);
    Auth.signOut();
  };

  return (
    <Button className="button-primary" onClick={DoLogout} id="logoutButton">
      {'Logout '}
      <FaSignOutAlt className="logout-icon" />
    </Button>
  );
};

export default Logout;
