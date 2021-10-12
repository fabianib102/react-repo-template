import React, { useState, FC } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import ChannelService from '../services/ChannelService';
import { Channel } from '../models/Channel';
import Constants from '../assets/utils/Constants';
import { abrConfiguration } from '../services/red5pro.config';
import AbrService from '../services/AbrService';
import { generateId } from '../services/GeneralService';
import { useLoader } from '../context/LoaderContext';
import '../assets/css/Styles.scss';

const channelService = new ChannelService();
const abrService = new AbrService();

interface Props {
  show: boolean;
  onSuccessCreateChannel: () => Promise<void>;
  shownotification: any;
  onClose: any;
}

const NewChannelModal: FC<Props> = (props: Props) => {
  const [channelName, setName] = useState('');
  const [hasAbr, setHasAbr] = useState(false);
  const [errors, setErrors] = useState({ channelName: '' });
  const { setIsLoading } = useLoader();
  const { onSuccessCreateChannel, shownotification, ...rest } = props;
  const Save = async () => {
    if (!ValidateForm()) return;
    const channel = {} as Channel;
    channel.channelName = channelName;
    channel.hasAbr = hasAbr;
    try {
      setIsLoading(true);
      await streamProvision(hasAbr, generateId(channelName, hasAbr));
      await channelService.createChannel(channel);
      shownotification(Constants.SUCCESS, Constants.CHANNEL_CREATION_SUCCESS, Constants.CHANNEL_ERROR);
      await onSuccessCreateChannel();
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
      shownotification(Constants.ERROR, `${Constants.CHANNEL_CREATION_ERROR}${err.message}`, Constants.CHANNEL_ERROR);
      setIsLoading(false);
    }
  };

  const streamProvision = async (shouldProvision: boolean, id: string) => {
    if (!shouldProvision) return;
    try {
      const abrNewConfig = { ...abrConfiguration };
      abrNewConfig.meta.stream = abrNewConfig.meta.stream.map((quality) => ({
        ...quality,
        name: `${id.slice(0, -2)}_${quality.level}`,
      }));
      await abrService.createStreamProvision(id, abrNewConfig);
    } catch (err: any) {
      console.log(err);
      throw new Error(Constants.ABR_STREAM_PROVISION_ERROR);
    }
  };

  const ValidateForm = () => {
    setErrors({ channelName: '' });
    let error = false;

    if (!channelName || channelName.length === 0 || channelName.trim().length === 0) {
      setErrors((prevState) => ({
        ...prevState,
        channelName: 'Name is required!',
      }));
      error = true;
    }

    return !error;
  };

  const ResetModal = () => {
    setErrors({ channelName: '' });
    setName('');
    setHasAbr(false);
  };

  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" onEnter={ResetModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{`CREATE NEW ${Constants.CHANNEL_LABEL.toUpperCase()}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              isInvalid={!!errors.channelName}
              type="text"
              placeholder="Example conference name"
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">{errors.channelName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formAbr">
            <Form.Check
              type="checkbox"
              label="Has ABR"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setHasAbr(target.checked);
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onClose} variant="secondary">
          CLOSE
        </Button>
        <Button id="buttonCreateOk" onClick={() => Save()} className="button-primary">
          CREATE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewChannelModal;
