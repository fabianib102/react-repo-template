import React, { FC } from 'react';
import Constants from '../../../assets/utils/Constants';
import ConfirmationModal from '../../ConfirmationModal';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  showModal: boolean;
}

const ParticipantInvitation: FC<Props> = (props: Props) => {
  const title = Constants.INVITATION_MODAL.TITLE;
  const body = Constants.INVITATION_MODAL.BODY;

  return <ConfirmationModal show={props.showModal} title={title} body={body} onConfirm={props.onConfirm} onCancel={props.onCancel} />;
};

export default ParticipantInvitation;
