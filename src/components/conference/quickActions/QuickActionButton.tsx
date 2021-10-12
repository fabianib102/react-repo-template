import React, { FC } from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import '../../../assets/css/QuickActionButtonStyles.scss';
import '../../../assets/css/Styles.scss';
import { TooltipPlacement } from '../../../assets/utils/Enums';

interface Props {
  title: string;
  icon: any;
  onClick?: any;
  className?: string;
  tooltipPlacement: TooltipPlacement | undefined;
}

const QuickActionButton: FC<Props> = (props: Props) => {
  return (
    <OverlayTrigger placement={props.tooltipPlacement} overlay={<Tooltip id="popover">{props.title}</Tooltip>}>
      <Button onClick={props.onClick} className={`quick-action-button button-primary ${props.className}`}>
        <div className="icon">{props.icon}</div>
      </Button>
    </OverlayTrigger>
  );
};

QuickActionButton.defaultProps = {
  onClick: () => {},
  className: '',
};

export default QuickActionButton;
