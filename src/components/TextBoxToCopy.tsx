import React, { useRef, FC, useState } from 'react';
import { OverlayTrigger, Tooltip, InputGroup, Form } from 'react-bootstrap';
import { FaCopy } from 'react-icons/fa';

interface Props {
  textValue?: string;
  tooltipHideTimeout: number;
  additionalIcon?: any;
  additionalIconHandler?: any;
  customId: string;
}

const TextBoxToCopy: FC<Props> = (props: Props) => {
  const targetRef = useRef(null) as any;
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = () => {
    setShowOverlay(true);
    const copyText = targetRef.current.value;
    const textArea = document.createElement('textarea');
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setTimeout(() => {
      setShowOverlay(false);
    }, props.tooltipHideTimeout || 1000);
  };

  return (
    <div id={props.customId}>
      <OverlayTrigger
        rootClose
        target={targetRef.current}
        placement="top"
        trigger="click"
        show={showOverlay}
        overlay={<Tooltip id="popover">Copied!</Tooltip>}
      >
        <InputGroup id={`input-group-${props.customId}`}>
          <Form.Control ref={targetRef} type="text" readOnly value={props.textValue || ''} />
          {props.additionalIcon && (
            <InputGroup.Append onClick={props.additionalIconHandler} id="additional-button">
              <InputGroup.Text>{props.additionalIcon}</InputGroup.Text>
            </InputGroup.Append>
          )}
          <InputGroup.Append onClick={handleClick}>
            <InputGroup.Text>
              <OverlayTrigger rootClose placement="top" overlay={<Tooltip id="popover">Copy to clipboard</Tooltip>}>
                <FaCopy />
              </OverlayTrigger>
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </OverlayTrigger>
    </div>
  );
};

TextBoxToCopy.defaultProps = {
  textValue: '',
  additionalIcon: undefined,
  additionalIconHandler: undefined,
};

export default TextBoxToCopy;
