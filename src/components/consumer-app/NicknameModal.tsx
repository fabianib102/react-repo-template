import React, { FC, useState } from 'react';
import { FormControl, Col, Row, InputGroup } from 'react-bootstrap';
import ConfirmationModal from '../ConfirmationModal';

interface Props {
  onConfirm: any;
  onCancel: () => void;
  showModal: boolean;
  setNickName: (nickname: string) => void;
}

const NicknameModal: FC<Props> = (props: Props) => {
  const title = 'Choose your nickname';
  const { onConfirm, onCancel, showModal, setNickName } = props;
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

  const onNicknameChange = (e: any) => {
    setNickName(e.target.value);
    if (e.target.value) {
      setIsConfirmEnabled(true);
    } else {
      setIsConfirmEnabled(false);
    }
  };

  const body = () => {
    return (
      <>
        <Row>
          <Col xs={12}>
            <InputGroup className="my-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={onNicknameChange}
                placeholder="Enter your nickname"
              />
            </InputGroup>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <ConfirmationModal
      isConfirmEnabled={isConfirmEnabled}
      show={showModal}
      title={title}
      body={body()}
      confirmLabel="ACCESS"
      cancelLabel="CHOOSE ONE FOR ME"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default NicknameModal;
