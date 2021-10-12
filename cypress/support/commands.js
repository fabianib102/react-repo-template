import { abrConfiguration } from '../../src/services/red5pro.config';
import Constants from '../../src/assets/utils/Constants';

Cypress.Commands.add('mountCredentials', () => {
  const fakeuserId = 'fakeIdentity';
  const idTokenKey = `CognitoIdentityServiceProvider.${Cypress.env("REACT_APP_CLIENT_ID")}.${fakeuserId}.idToken`;
  const lastUserKey = `CognitoIdentityServiceProvider.${Cypress.env("REACT_APP_CLIENT_ID")}.LastAuthUser`;

  const token = JSON.stringify({ "fakeToken": "stuff" });
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const parsedTokens = JSON.stringify({ exp: Math.floor(tomorrow / 1000) });
  cy.window().then((win) => {
    win.localStorage.setItem(lastUserKey, fakeuserId);
    win.localStorage.setItem(Constants.AUTH.LOCAL_STORAGE_KEY, parsedTokens);
    win.localStorage.setItem(idTokenKey, token);
  });
  cy.visit('/');
});

Cypress.Commands.add('createABRTestChannel', (channelName) => {
  cy.request('POST', `${Cypress.env("REACT_APP_BASE_URL")}/channels`, {
    channelName,
    hasAbr: true,
  });
});

Cypress.Commands.add('createTestChannel', (channelName) => {
  cy.request('POST', `${Cypress.env("REACT_APP_BASE_URL")}/channels`, {
    channelName,
    hasAbr: false,
  });
});

Cypress.Commands.add('deleteABRTestChannel', (channelName) => {
  cy.request('DELETE', `${Cypress.env("REACT_APP_BASE_URL")}/channels/${channelName}_1`);
});

Cypress.Commands.add('deleteTestChannel', (channelName) => {
  cy.request('DELETE', `${Cypress.env("REACT_APP_BASE_URL")}/channels/${channelName}`);
});

Cypress.Commands.add('createStreamProvision', (channelName) => {
  cy.request(
    'POST',
    `https://${Cypress.env("REACT_APP_STREAM_MANAGER_URL")}/streammanager/api/4.0/admin/event/meta/live/${channelName}_1?accessToken=${Cypress.env("REACT_APP_ACCESS_TOKEN")}`,
    abrConfiguration
  );
});

Cypress.Commands.add('clearStreamProvision', (channelName) => {
  cy.request(
    'DELETE',
    `https://${Cypress.env("REACT_APP_STREAM_MANAGER_URL")}/streammanager/api/4.0/admin/event/meta/live/${channelName}_1?accessToken=${Cypress.env("REACT_APP_ACCESS_TOKEN")}`
  );
});
