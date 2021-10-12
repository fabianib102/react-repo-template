import React, { FC, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import { Form, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Channel } from '../models/Channel';
import AbrService from '../services/AbrService';
import ChannelService from '../services/ChannelService';
import ConfirmationModal from './ConfirmationModal';
import { useLoader } from '../context/LoaderContext';
import Constants from '../assets/utils/Constants';
import '../assets/css/ChannelsTableStyles.scss';

const channelService = new ChannelService();
const abrService = new AbrService();

interface Props {
  data: any;
  onDeleteChannel: () => Promise<void>;
  shownotification: any;
}

const ChannelsTable: FC<Props> = (props: Props) => {
  const [channelToDelete, setChannelToDelete] = useState({ showModal: false, row: { id: '', hasAbr: false, channelName: '' } });
  const [channelToSendInvitation, setChannelToSendInvitation] = useState({ showModal: false, row: { id: '' } });
  const { setIsLoading } = useLoader();
  const [userEmails, setUserEmails] = useState('');
  const [userNumbers, setUserNumbers] = useState('');

  const deleteChannel = async (id: string) => {
    try {
      setIsLoading(true);
      if (channelToDelete.row.hasAbr) await streamDeleteProvision(id);
      await channelService.deleteChannel(id);
      await props.onDeleteChannel();
      props.shownotification(Constants.SUCCESS, Constants.CHANNEL_DELETION_SUCCESS, Constants.CHANNEL_ERROR);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      props.shownotification(Constants.ERROR, `${Constants.CHANNEL_DELETION_ERROR}${e.message}`, Constants.CHANNEL_ERROR);
      setIsLoading(false);
    }
    closeDeleteModal();
  };

  const sendInvitation = async (id: string) => {
    try {
      setIsLoading(true);
      const dataToSend = {
        emails: userEmails.replace(/ /g, '').split(','),
        cellphones: userNumbers.replace(/ /g, '').split(','),
      };
      await channelService.sendChannelInvitations(id, dataToSend);
      props.shownotification(Constants.SUCCESS, Constants.SEND_INVITATION_SUCCESS);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      props.shownotification(Constants.ERROR, Constants.SEND_INVITATION_ERROR, Constants.CHANNEL_ERROR);
      setIsLoading(false);
    }
    closeSendInvitationModal();
  };

  const streamDeleteProvision = async (id: string) => {
    try {
      await abrService.deleteStreamProvision(id);
    } catch (error: any) {
      throw new Error(Constants.ABR_DELETE_STREAM_PROVISION_ERROR);
    }
  };

  const closeDeleteModal = () => {
    setChannelToDelete({ showModal: false, row: { id: '', hasAbr: false, channelName: '' } });
  };

  const closeSendInvitationModal = () => {
    setChannelToSendInvitation({ showModal: false, row: { id: '' } });
  };

  const getVisualStatus = (status: string) => {
    switch (status) {
      case Constants.STATUS.ONLINE:
        return Constants.STATUS.Live;
      case Constants.STATUS.OFFLINE:
      default:
        return Constants.STATUS.Offline;
    }
  };

  const columns = [
    {
      name: Constants.CHANNEL_LABEL,
      selector: 'channelName',
      sortable: true,
      cell: (row: Channel) => <Link to={`/channel/${row.id}`}>{row.channelName}</Link>,
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: (row: Channel) => (
        <div className="status-container">
          <span className="center-vertical">{getVisualStatus(row.channelStatus)}</span>
        </div>
      ),
    },
    {
      name: 'Action',
      selector: '',
      sortable: false,
      cell: (row: Channel) => (
        <>
          <div className="status-container">
            <FaTrashAlt
              onClick={() => setChannelToDelete({ showModal: true, row })}
              className={`delete-${row.id} table-icon`}
              title={`Delete ${Constants.CHANNEL_LABEL}`}
            />
          </div>
          <div className="status-container">
            <FaEnvelope
              onClick={() => setChannelToSendInvitation({ showModal: true, row })}
              className="invitation-icon table-icon"
              title="Send Invitation"
            />
          </div>
        </>
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '72px', // override the row height
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#ccc',
        borderTopWidth: '0px',
        '&:not(:last-of-type)': {
          borderBottomWidth: '0px',
        },
      },
      stripedStyle: {
        backgroundColor: '#f4f4f4',
      },
    },
    footer: {
      style: {
        backgroundColor: 'red',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#ccc',
        minHeight: '56px',
        fontWeight: 500,
        borderStyle: 'solid',
        borderWidth: '0px',
        borderColor: '#ccc',
      },
      denseStyle: {
        minHeight: '32px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        fontWeight: 600,
        fontSize: '20px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
        fontSize: '14px',
      },
    },
  };

  const modalBody = (
    <>
      Are you sure you want to delete the {Constants.CHANNEL_LABEL.toLowerCase()}: <b>{channelToDelete.row.channelName}</b>?<br />
      This operation cannot be undone.
    </>
  );

  const invitationBody = (
    <>
      <Form.Group as={Row}>
        <Form.Label className="label-form-invitation" column sm="2">
          Email
          <OverlayTrigger placement="top" overlay={<Tooltip id="">{Constants.SEND_INVITATION_TOOLTIP_MESSAGE.EMAILS}</Tooltip>}>
            <FaInfoCircle className="info-icon" />
          </OverlayTrigger>
        </Form.Label>
        <Col sm="10">
          <Form.Control as="textarea" rows={2} className="user-email" onChange={(e) => setUserEmails(e.target.value)} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label className="label-form-invitation" column sm="2">
          SMS
          <OverlayTrigger placement="top" overlay={<Tooltip id="">{Constants.SEND_INVITATION_TOOLTIP_MESSAGE.CELLPHONES}</Tooltip>}>
            <FaInfoCircle className="info-icon" />
          </OverlayTrigger>
        </Form.Label>
        <Col sm="10">
          <Form.Control as="textarea" rows={2} className="user-number" onChange={(e) => setUserNumbers(e.target.value)} />
        </Col>
      </Form.Group>
    </>
  );

  return (
    <>
      <DataTable
        className="event-list-table"
        columns={columns}
        customStyles={customStyles}
        data={props.data}
        theme="light"
        noHeader
        pagination
        striped
        paginationPerPage={20}
      />
      <ConfirmationModal
        show={channelToDelete.showModal}
        body={modalBody}
        title={`DELETE ${Constants.CHANNEL_LABEL.toUpperCase()} CONFIRMATION`}
        onConfirm={() => deleteChannel(channelToDelete.row.id)}
        onCancel={closeDeleteModal}
      />
      <ConfirmationModal
        show={channelToSendInvitation.showModal}
        body={invitationBody}
        title={Constants.SEND_INVITATION}
        onConfirm={() => sendInvitation(channelToSendInvitation.row.id)}
        onCancel={closeSendInvitationModal}
        confirmLabel={Constants.SEND_INVITATION}
        isConfirmEnabled={userEmails.length > 0 || userNumbers.length > 0}
      />
    </>
  );
};

export default ChannelsTable;
