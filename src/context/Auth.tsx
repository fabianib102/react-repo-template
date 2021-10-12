import React, { createContext, useContext, FC, useReducer } from 'react';
import { IAuthData } from '../assets/utils/Interfaces';
import Constants from '../assets/utils/Constants';

interface Props {
  children: React.ReactNode;
}

const defaultAuthData: IAuthData = {
  progress: Constants.AUTH_STEPS.LOGGED_OUT,
  idToken: '',
  accessToken: '',
  exp: 0,
  name: '',
  email: '',
  username: '',
  awsCredentials: {
    accessKeyId: '',
    authenticated: false,
    identityId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
};

enum ActionKind {
  LogIn = 'LOGIN',
  LogOut = 'LOGOUT',
  LoggedOut = 'LOGGED_OUT',
  LoggedIn = 'LOGGED_IN',
}

type Action = { type: ActionKind; payload: IAuthData };

const isAuthenticated = () => {
  const lastUser = localStorage.getItem(Constants.AUTH.COGNITO_LAST_AUTH_USER_KEY);
  const idToken = localStorage.getItem(Constants.AUTH.COGNITO_ID_TOKEN_KEY(lastUser));
  const expirationTime = JSON.parse(localStorage.getItem(Constants.AUTH.LOCAL_STORAGE_KEY) || '{}').exp;
  const isTokenExpired = expirationTime - Date.now() / 1000 <= 0;
  return !!idToken && !isTokenExpired;
};

const AuthContext = createContext<{ authData: IAuthData; setAuthData: React.Dispatch<Action> } | undefined>(undefined);

const AuthProcess = (state: IAuthData, action: Action): IAuthData => {
  const newAuthData = { ...state, ...action.payload, progress: action.type };
  localStorage.setItem(Constants.AUTH.LOCAL_STORAGE_KEY, JSON.stringify(newAuthData));
  return newAuthData;
};

const Provider: FC<Props> = (props: Props) => {
  const existingTokens = JSON.parse(localStorage.getItem(Constants.AUTH.LOCAL_STORAGE_KEY) || '{}');
  const [authData, setAuthData] = useReducer(AuthProcess, { ...defaultAuthData, ...existingTokens });
  const value = { authData, setAuthData };
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }
  return context;
};

const Auth = { Provider, useAuth, ActionKind, defaultAuthData, isAuthenticated };

export default Auth;
