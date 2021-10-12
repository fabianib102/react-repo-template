import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Constants from '../../assets/utils/Constants';

interface Props {
  participantsList: Array<string>;
}

const NumberOfViewers: FC<Props> = (props: Props) => {
  const getParticipantsAmountWithoutScreenSharing = () => {
    const filtered = props.participantsList.filter((participant) => !participant.includes(Constants.SCREEN_SHARE_PUBLISHER));
    return filtered.length;
  };

  return (
    <div className="viewers">
      <div>
        <FontAwesomeIcon icon={faUser} /> {getParticipantsAmountWithoutScreenSharing()}
      </div>
    </div>
  );
};

export default NumberOfViewers;
