import React, { FC } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../assets/css/Styles.scss';

interface Props {
  title: string;
  showHeader: boolean;
  className?: string;
}

const SubComponentHeader: FC<Props> = (props: Props) => {
  return (
    <Row className={`sub-header ${props.className} ${props.showHeader ? '' : 'hidden'}`}>
      <Col xs={12}>{props.title}</Col>
    </Row>
  );
};

SubComponentHeader.defaultProps = {
  className: '',
};

export default SubComponentHeader;
