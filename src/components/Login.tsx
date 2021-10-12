import React, { FC, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Container, Button, Card } from 'react-bootstrap';
import { withOAuth } from 'aws-amplify-react';
import { FaWindows, FaKey } from 'react-icons/fa';
import Footer from './Footer';
import { useLoader } from '../context/LoaderContext';
import AuthContext from '../context/Auth';
import '../assets/css/Styles.scss';
import Constants from '../assets/utils/Constants';
import wrappers from '../assets/utils/Window';

interface Props {
  shownotification: any;
}

const Login: FC<Props> = (props: Props) => {
  const { setIsLoading } = useLoader();
  const { authData, setAuthData } = AuthContext.useAuth();
  const history = useHistory();

  const isRedirectedFromIDP = history.location.search.includes(Constants.AUTH.CODE_PARAM);
  const isLoginInProcess = isRedirectedFromIDP && !AuthContext.isAuthenticated();
  const isLoginSucceded = isRedirectedFromIDP && AuthContext.isAuthenticated();

  useEffect(() => {
    if (isLoginInProcess) {
      setIsLoading(true);
    } else {
      setAuthData({ type: AuthContext.ActionKind.LoggedOut, payload: AuthContext.defaultAuthData });
    }
    // eslint-disable-next-line
  }, []);

  const doLogin = async () => {
    setIsLoading(true);
    setAuthData({ type: AuthContext.ActionKind.LogIn, payload: authData });
    try {
      wrappers.navigate(Constants.AUTH.TARGET_URI);
    } catch (err) {
      props.shownotification('ERROR', err.message, 'Error');
      setIsLoading(false);
    }
  };

  return isLoginSucceded ? (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  ) : (
    <Container fluid className="p-5 d-flex justify-content-center align-items-center">
      <div className="login-container">
        <Card.Body className="d-flex flex-column align-items-center">
          <div className="round-container">
            <FaKey />
          </div>
          <Card.Footer>
            <Button id="signInButton" size="lg" block onClick={doLogin} className="button-primary" name="signIn">
              <FaWindows style={{ margin: '0 5px 2px' }} />
              SIGN IN WITH AZURE
            </Button>
          </Card.Footer>
        </Card.Body>
      </div>
      <Footer />
    </Container>
  );
};

export default withOAuth(Login);
