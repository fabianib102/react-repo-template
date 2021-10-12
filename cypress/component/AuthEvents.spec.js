import React from 'react';
import { mount } from '@cypress/react';
import AuthContext from '../../src/context/Auth';
import { Hub, Auth } from 'aws-amplify';
import App from '../../src/App';
import Constants from '../../src/assets/utils/Constants';

describe('Authentication Events on App Should', () => {
  let setAuthDataStub;
  const userData = {
    signInUserSession: {
      idToken: { payload: { exp: 1000000, iat: 0 }, jwtToken: '' },
      accessToken: { payload: { exp: 1000000, iat: 0 }, jwtToken: '' },
      refreshToken: { payload: { exp: 1000000, iat: 0 }, jwtToken: '' },
    },
    attributes: {
      email: 'email@email.com',
      name: 'the name',
    },
    username: 'TheUsername',
    getSignInUserSession: () => {
      return;
    },
    refreshSession: () => {
      return;
    },
  };

  const HubMockDispatch = (event) => {
    Hub.dispatch('auth', {
      event,
      data: {},
      message: '',
    });
  };

  const expectedCredentials = {
    progress: 'mockStep',
    accessToken: userData.signInUserSession.accessToken.jwtToken,
    idToken: userData.signInUserSession.idToken.jwtToken,
    refreshToken: userData.signInUserSession.refreshToken.jwtToken,
    email: userData.attributes.email,
    name: userData.attributes.name,
    exp: userData.signInUserSession.idToken.payload.exp,
    username: userData.username,
    awsCredentials: {},
    ttl: userData.signInUserSession.idToken.payload.exp - userData.signInUserSession.idToken.payload.iat,
  };

  beforeEach(() => {
    setAuthDataStub = cy.stub().as('setAuthData');
    cy.stub(window, 'setTimeout').as('setTimeout');
    cy.stub(Auth, 'currentAuthenticatedUser').resolves(userData);
    cy.stub(Auth, 'currentCredentials').resolves({});
    cy.stub(AuthContext, 'isAuthenticated').resolves(true);
    cy.stub(AuthContext, 'useAuth').returns({ authData: { progress: 'mockStep', exp: 0 }, setAuthData: setAuthDataStub });
    mount(
      <AuthContext.Provider>
        <App />
      </AuthContext.Provider>
    );
  });

  it('Set a timeout to refresh the tokens when the user is already authenticated', () => {
    cy.get('@setTimeout').should('have.been.called');
  });

  it('Store the Tokens after a successful signIn process', () => {
    HubMockDispatch(Constants.AUTH.EVENTS.SIGN_IN);
    cy.get('@setTimeout').should('have.been.called');
    cy.get('@setAuthData').should('have.been.calledWith', { type: AuthContext.ActionKind.LoggedIn, payload: expectedCredentials });
  });

  it('Update the Tokens after a successful tokenRefresh procedure', () => {
    HubMockDispatch(Constants.AUTH.EVENTS.TOKEN_REFRESH);
    cy.get('@setAuthData').should('have.been.calledWith', { type: AuthContext.ActionKind.LoggedIn, payload: expectedCredentials });
  });
});
