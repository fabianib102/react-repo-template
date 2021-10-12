import React, { FC, useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, Table, Badge, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaBan, FaRedo, FaEllipsisH } from 'react-icons/fa';
import { useLoader } from '../../context/LoaderContext';
import '../../assets/css/InfrastructureStyles.scss';
import Constants from '../../assets/utils/Constants';

const responseObject = {
  instanceId: 'i-123456789abcde9',
  instanceType: 'm4.large',
  availabilityZone: 'us-east-2a',
  state: Constants.EC2_INSTANCE_STATES.RUNNING,
  publicIp: '10.0.0.1',
  Nodes: [
    {
      type: 'Origin',
      ipAddress: '12.3.2.65',
      state: Constants.EC2_INSTANCE_STATES.RUNNING,
    },
    {
      type: 'Edge',
      ipAddress: '31.3.5.165',
      state: Constants.EC2_INSTANCE_STATES.STOPPED,
    },
    {
      type: 'Transcoder',
      ipAddress: '17.43.9.5',
      state: Constants.EC2_INSTANCE_STATES.PENDING,
    },
  ],
};

// This fn is just to test the UX
const newStatusMock = (initialStatus: string) => {
  switch (initialStatus) {
    case Constants.EC2_INSTANCE_STATES.RUNNING:
      return Constants.EC2_INSTANCE_STATES.STOPPING;
    case Constants.EC2_INSTANCE_STATES.STOPPED:
      return Constants.EC2_INSTANCE_STATES.PENDING;
    case Constants.EC2_INSTANCE_STATES.STOPPING:
      return Constants.EC2_INSTANCE_STATES.STOPPED;
    case Constants.EC2_INSTANCE_STATES.PENDING:
      return Constants.EC2_INSTANCE_STATES.RUNNING;
    default:
      return Constants.EC2_INSTANCE_STATES.PENDING;
  }
};

const Infrastructure: FC = () => {
  const [instanceStatus, setInstanceStatus] = useState(responseObject.state);
  const [spinner, setSpinner] = useState(false);
  const { setIsLoading } = useLoader();

  const changeStreamManagerStatus = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newStatus = newStatusMock(instanceStatus);
      setInstanceStatus(newStatus);
      setIsLoading(false);
    }, 1000);
  };

  const refreshCurrentStatus = () => {
    setSpinner(true);
    setTimeout(() => {
      setSpinner(false);
      if (instanceStatus === Constants.EC2_INSTANCE_STATES.RUNNING || instanceStatus === Constants.EC2_INSTANCE_STATES.STOPPED) return;
      const newStatus = newStatusMock(instanceStatus);
      setInstanceStatus(newStatus);
    }, 1000);
  };

  const statusClass = (state?: string) => {
    switch (state) {
      case Constants.EC2_INSTANCE_STATES.RUNNING:
        return 'running';
      case Constants.EC2_INSTANCE_STATES.STOPPED:
      case Constants.EC2_INSTANCE_STATES.TERMINATED:
        return 'stop';
      default:
        return 'in-progress';
    }
  };

  const statusIcon = () => {
    switch (instanceStatus) {
      case Constants.EC2_INSTANCE_STATES.RUNNING:
        return <FaCheckCircle />;
      case Constants.EC2_INSTANCE_STATES.STOPPED:
      case Constants.EC2_INSTANCE_STATES.TERMINATED:
        return <FaBan />;
      default:
        return <FaEllipsisH />;
    }
  };

  const buttonStatus = () => {
    if (instanceStatus === Constants.EC2_INSTANCE_STATES.RUNNING || instanceStatus === Constants.EC2_INSTANCE_STATES.STOPPED) return false;
    return true;
  };

  return (
    <Container className="infrastructure">
      <Row>
        <Col className="d-flex justify-content-center p-top-bottom-10">
          <Card>
            <Card.Header>
              Stream Manager Id: <b>{responseObject.instanceId}</b>
            </Card.Header>
            <Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>
                  <div className={`instance-status ${statusClass(instanceStatus)}`}>
                    <b>{instanceStatus}</b>
                    {statusIcon()}
                    <Button onClick={refreshCurrentStatus} disabled={spinner} className="btn-icon">
                      {spinner ? <Spinner size="sm" animation="border" /> : <FaRedo id="refresh" />}
                    </Button>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  Instance Type: <b>{responseObject.instanceType}</b>
                </ListGroupItem>
                <ListGroupItem>
                  Availability Zone: <b>{responseObject.availabilityZone}</b>
                </ListGroupItem>
                <ListGroupItem>
                  Public Ip: <b>{responseObject.publicIp}</b>
                </ListGroupItem>
              </ListGroup>
              <Button onClick={changeStreamManagerStatus} disabled={buttonStatus()}>
                {instanceStatus === Constants.EC2_INSTANCE_STATES.RUNNING ? 'Stop' : 'Start'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col className="p-top-bottom-10">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {responseObject.Nodes.map((node, index) => (
                <tr key={node.ipAddress}>
                  <td>{index + 1}</td>
                  <td>{node.type}</td>
                  <td>{node.ipAddress}</td>
                  <td>
                    <Badge className={statusClass(node.state)}>{node.state}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Infrastructure;
