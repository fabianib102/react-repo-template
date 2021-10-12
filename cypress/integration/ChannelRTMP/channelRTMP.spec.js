import Constants from '../../../src/assets/utils/Constants';
import channelList from '../../fixtures/channelList.json';
const channelName = channelList[0].channelName;

describe('Test if the RTMP protocol option is currently disabled', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/channels`, channelList);
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/channel/${channelName}`, channelList[0]);
    cy.mountCredentials();
  });

  it('check that RTMP option is currently disabled', () => {
    cy.get('.event-list-table a').first().click();
    cy.get('#tabs-channel-details-tab-RTMP').should('have.class', 'disabled');
  });

  it('clicking go back should navigate to the channel list', () => {
    cy.get('.event-list-table a').first().click();
    cy.get('#backButton').should('be.enabled');
    cy.get('#backButton').click({ force: true });
    cy.contains(`CREATE ${Constants.CHANNEL_LABEL.toUpperCase()}`);
  });
});
