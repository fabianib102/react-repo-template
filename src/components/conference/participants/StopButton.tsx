import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import '../../../assets/css/StopButton.scss';
import QuickActionButton from '../quickActions/QuickActionButton';
import { TooltipPlacement } from '../../../assets/utils/Enums';

interface Props {
  stopCoStreaming?: () => Promise<void>;
}

const StopButton: FC<Props> = (props: Props) => {
  const { stopCoStreaming } = props;
  return (
    <QuickActionButton
      className="stop-live-feed"
      title="Stop Live Feed"
      tooltipPlacement={TooltipPlacement.top}
      icon={<FontAwesomeIcon icon={faStopCircle} />}
      onClick={stopCoStreaming}
    />
  );
};

StopButton.defaultProps = {
  stopCoStreaming: async () => {},
};

export default StopButton;
