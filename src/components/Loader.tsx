import React, { FC } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import '../assets/css/LoaderStyles.scss';

interface Props {
  show: boolean;
}

const Loader: FC<Props> = (props: Props) => {
  const { show } = props;
  return show ? (
    <div className="loader">
      <Spinner animation="border" id="spinner-loader" />
    </div>
  ) : null;
};

export default Loader;
