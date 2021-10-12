import React, { FC } from 'react';
import { Container } from 'react-bootstrap';
import '../assets/css/ContainerStyles.scss';

interface Props {
  content: any;
}

const Containter: FC<Props> = (props: Props) => {
  const { content } = props;
  const childrenName = content.type.name;

  return <Container className={`p-5 container-lg general-container ${childrenName} d-flex`}>{content}</Container>;
};

export default Containter;
