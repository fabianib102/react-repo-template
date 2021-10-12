import React, { FC } from 'react';
import '../assets/css/Styles.scss';
import '../assets/css/Notifications.scss';
import { Toast, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Props {
  show: boolean;
  message: string;
  type: string;
  onClose: () => void;
}

const Notification: FC<Props> = (props: Props) => {
  return (
    <div aria-live="polite" aria-atomic="true" className="notification-container">
      <Toast onClose={props.onClose} show={props.show} delay={2500} autohide className={`notification-toast ${props.type.toLowerCase()}`}>
        <Toast.Body className="toast-body">
          <p className="toast-message">{props.message}</p>
          <Button onClick={props.onClose} variant="link" className="toast-btn-dismiss">
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default Notification;
