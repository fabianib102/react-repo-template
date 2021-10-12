import React, { FC } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../assets/css/Styles.scss';

interface Props {
  show: boolean;
  title: string;
  body: string | React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  cancelLabel?: string;
  onCancel: () => void;
  size?: 'sm' | 'lg' | 'xl';
  isConfirmEnabled?: boolean;
}

const ConfirmationModal: FC<Props> = (props: Props) => {
  return (
    <>
      <Modal size={props.size} aria-labelledby="contained-modal-title-vcenter" centered show={props.show} onHide={props.onCancel} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button id="cancel" variant="secondary" onClick={props.onCancel}>
            {props.cancelLabel}
          </Button>
          <Button id="confirm" className="button-primary" onClick={props.onConfirm} disabled={!props.isConfirmEnabled}>
            {props.confirmLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ConfirmationModal.defaultProps = {
  cancelLabel: 'CANCEL',
  confirmLabel: 'CONFIRM',
  size: 'lg',
  isConfirmEnabled: true,
};

export default ConfirmationModal;
