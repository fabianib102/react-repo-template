/* eslint-disable react/jsx-boolean-value */
import React, { useState, FC, useEffect } from 'react';
import './assets/css/Styles.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Hub, Auth } from 'aws-amplify';
import Header from './components/Header';
import Home from './components/Home';
import ConsumerHome from './components/consumer-app/ConsumerHome';
import GridPreview from './components/consumer-app/GridPreview';
import Login from './components/Login';
import Notification from './components/Notification';
import ChannelDetails from './components/ChannelDetails';
import AuthContext from './context/Auth';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader';
import { LoaderContext } from './context/LoaderContext';
import { ShowNotificationContext } from './context/ShowNotificationContext';
import { ChannelContext, selectedChannel } from './context/ChannelContext';
import Constants from './assets/utils/Constants';
import Conference from './components/conference/Conference';
import ConsumerConference from './components/consumer-app/ConsumerConference';
import Infrastructure from './components/infrastructure/Infrastructure';
import { Channel } from './models/Channel';
import Red5ProContext from './context/Red5ProServiceContext';
import Container from './components/Container';

const App: FC = () => {
  const [header] = useState('Ultra Low Latency Platform');
  const { authData, setAuthData } = AuthContext.useAuth();
  const [loadingObject, setLoadingObject] = useState({ isLoading: false });
  const [objectNotification, setObjectNotification] = useState({ show: false, message: '', type: '' });
  const [channelObject, setChannelObject] = useState({ selectedChannel });

  const getNewTokens = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const useSession = cognitoUser.getSignInUserSession();
      cognitoUser.refreshSession(useSession.refreshToken, (err: any) => {
        if (err) throw err;
      });
    } catch (error) {
      console.log('Unable to get new Tokens', error);
      throw error;
    }
  };

  const storeAuthParams = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const awsCredentials = await Auth.currentCredentials();
    const { exp, iat } = userData.signInUserSession.idToken.payload;
    const ttl = exp - iat;
    const authCredentials = {
      progress: authData.progress,
      accessToken: userData.signInUserSession.accessToken.jwtToken,
      idToken: userData.signInUserSession.idToken.jwtToken,
      exp,
      refreshToken: userData.signInUserSession.refreshToken.jwtToken,
      email: userData.attributes.email,
      name: userData.attributes.name,
      username: userData.username,
      awsCredentials,
      ttl,
    };
    setAuthData({ type: AuthContext.ActionKind.LoggedIn, payload: authCredentials });
    setTimeout(getNewTokens, (ttl - 60) * 1000);
  };

  const OAuthEventListener = () => {
    Hub.listen('auth', async ({ payload: { event } }) => {
      console.log('[Hub] Auth event: ', event);
      switch (event) {
        case Constants.AUTH.EVENTS.SIGN_IN:
          setIsLoading(true);
          await storeAuthParams();
          break;
        case Constants.AUTH.EVENTS.TOKEN_REFRESH:
          await storeAuthParams();
          break;
        default:
          break;
      }
    });
  };

  useEffect(() => {
    OAuthEventListener();
    if (AuthContext.isAuthenticated()) {
      const timeToRefresh = authData.exp - Date.now() / 1000 - 60;
      setTimeout(getNewTokens, timeToRefresh > 0 ? timeToRefresh * 1000 : 0);
    }
    // eslint-disable-next-line
  }, []);

  const setIsLoading = (newValue: boolean) => {
    setLoadingObject({ isLoading: newValue });
  };

  const showNotification = (type: string, message: string) => {
    setObjectNotification({ show: true, type, message });
  };

  const setSelectedChannel = (newChannel: Channel) => {
    setChannelObject({ selectedChannel: newChannel });
  };

  const onNotificationClose = () => {
    setObjectNotification({ show: false, message: '', type: Constants.SUCCESS });
  };

  const homeComponent = <Home shownotification={showNotification} />;

  const channelDetailsComponent = <ChannelDetails shownotification={showNotification} />;

  const loginComponent = <Login shownotification={showNotification} />;

  const infrastructureComponent = <Infrastructure />;

  const routes = (
    <Switch>
      <PrivateRoute exact path="/">
        <Container content={homeComponent} />
      </PrivateRoute>
      <PrivateRoute exact path={`/${Constants.INFRASTRUCTURE_PATH}`}>
        <Container content={infrastructureComponent} />
      </PrivateRoute>
      <PrivateRoute exact path="/channel/:id">
        <Container content={channelDetailsComponent} />
      </PrivateRoute>
      <PrivateRoute exact path={`/${Constants.SPEAKER_PATH}/:conferenceId`}>
        <Conference />
      </PrivateRoute>
      <Route exact path={`/${Constants.LOGIN_PATH}`}>
        <Container content={loginComponent} />
      </Route>
      <Route exact path={`/${Constants.CONFERENCE_PATH}/:conferenceId`}>
        <ConsumerConference />
      </Route>
      <Route exact path={`/${Constants.CONSUMER_APP_PATH}`}>
        <ConsumerHome />
      </Route>
      <Route exact path={`/${Constants.CONSUMER_APP_PATH}/grid-preview`}>
        <GridPreview />
      </Route>
    </Switch>
  );

  return (
    <div className="App">
      <Router>
        <LoaderContext.Provider value={{ setIsLoading, ...loadingObject }}>
          <Header title={header} />
          <Notification
            show={objectNotification.show}
            message={objectNotification.message}
            type={objectNotification.type}
            onClose={onNotificationClose}
          />
          <Loader show={loadingObject.isLoading} />
          <ShowNotificationContext.Provider value={{ setObjectNotification, objectNotification }}>
            <Red5ProContext.Provider>
              <ChannelContext.Provider value={{ setSelectedChannel, ...channelObject }}>{routes}</ChannelContext.Provider>
            </Red5ProContext.Provider>
          </ShowNotificationContext.Provider>
        </LoaderContext.Provider>
      </Router>
    </div>
  );
};

export default App;
