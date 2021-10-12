import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/Index.scss';
import { Amplify, Auth } from 'aws-amplify';
import AuthContext from './context/Auth';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const config = {
  region: process.env.REACT_APP_REGION,
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  mandatorySignIn: true,
  oauth: {
    domain: `${process.env.REACT_APP_SIGNIN_DOMAIN}${process.env.REACT_APP_REGION}.amazoncognito.com`,
    scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.REACT_APP_IDP_REDIRECT_URL,
    redirectSignOut: process.env.REACT_APP_IDP_REDIRECT_URL,
    responseType: 'code',
    client_id: process.env.REACT_APP_CLIENT_ID,
  },
  federationTarget: 'COGNITO_USER_POOLS',
};

Amplify.configure(config);
Auth.configure({ config });

ReactDOM.render(
  <AuthContext.Provider>
    <App />
  </AuthContext.Provider>,
  document.getElementById('root')
);

reportWebVitals();
