import React, { FC } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import ConfirmationModal from '../ConfirmationModal';
import { IDeviceConfiguration, IDevices, IRenditions } from '../../assets/utils/Interfaces';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  showModal: boolean;
  onVideoDeviceSelected: (deviceId: string) => void;
  onAudioDeviceSelected: (deviceId: string) => void;
  onCapabilitiesSelected: (capability: string) => void;
  currentDeviceConfiguration: IDeviceConfiguration;
  isPerformingOperation: boolean;
  videoDevices: IDevices[];
  audioInputDevices: IDevices[];
  renditions: IRenditions[];
}

const ParticipantDeviceSettings: FC<Props> = (props: Props) => {
  const title = 'Configure your devices for co-streaming';
  const {
    onConfirm,
    onCancel,
    showModal,
    onVideoDeviceSelected,
    onAudioDeviceSelected,
    onCapabilitiesSelected,
    currentDeviceConfiguration,
    isPerformingOperation,
    videoDevices,
    audioInputDevices,
    renditions,
  } = props;

  const body = () => {
    return (
      <>
        <Row>
          <Col xs={8}>
            <video id="red5pro-publisher" className="red5pro-publisher" autoPlay playsInline muted style={{ width: '100%' }} />
          </Col>
          <Col xs={4} className="mt-2">
            <Form.Group controlId="camera-selector">
              <Form.Label>Select Camera</Form.Label>
              <Form.Control
                as="select"
                value={currentDeviceConfiguration?.video?.deviceId}
                onChange={(e: { target: { value: string } }) => {
                  onVideoDeviceSelected(e.target.value);
                }}
                disabled={isPerformingOperation}
              >
                {videoDevices.map((device: any) => (
                  <option key={`${device.id}-${device.name}`} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="mic-selector">
              <Form.Label>Select Microphone</Form.Label>
              <Form.Control
                as="select"
                value={currentDeviceConfiguration?.audio?.deviceId}
                onChange={(e: { target: { value: string } }) => {
                  onAudioDeviceSelected(e.target.value);
                }}
                disabled={isPerformingOperation}
              >
                {audioInputDevices.map((device: any) => (
                  <option key={`${device.id}-${device.name}`} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="rendition-selector">
              <Form.Label>Select Rendition</Form.Label>
              <Form.Control
                as="select"
                value={`${currentDeviceConfiguration?.video?.w}x${currentDeviceConfiguration?.video?.h}`}
                onChange={(e: { target: { value: string } }) => {
                  onCapabilitiesSelected(e.target.value);
                }}
                disabled={isPerformingOperation}
              >
                {renditions.map((rendition) => (
                  <option key={rendition.value} value={`${rendition.w}x${rendition.h}`} disabled={rendition.disabled}>
                    {rendition.value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <ConfirmationModal show={showModal} title={title} body={body()} confirmLabel="START CO-STREAMING" onConfirm={onConfirm} onCancel={onCancel} />
  );
};

export default ParticipantDeviceSettings;
