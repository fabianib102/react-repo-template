import Constants from '../../../src/assets/utils/Constants';

describe('Delete New Channel procedure should', () => {
  const channelName = String(Date.now());
  const channelNameAbr = String(Date.now() + 1);
  before(() => {
    cy.createTestChannel(channelName);
    cy.createStreamProvision(channelNameAbr);
    cy.createABRTestChannel(channelNameAbr);
  });

  beforeEach(() => {
    cy.mountCredentials();
  });

  it('Click to Delete a Channel should show the Delete Confirmation Modal', () => {
    cy.get(`.delete-${channelName}`).click();
    cy.contains(`DELETE ${Constants.CHANNEL_LABEL.toUpperCase()} CONFIRMATION`);
    cy.get('b').contains(channelName);
  });

  it('Click to Delete a Channel with ABR should show the Delete Confirmation Modal', () => {
    cy.get(`.delete-${channelNameAbr}_1`).click();
    cy.contains(`DELETE ${Constants.CHANNEL_LABEL.toUpperCase()} CONFIRMATION`);
    cy.get('b').contains(channelNameAbr);
  });

  it('Confirm Channel without ABR Deletion should make the corresponding API call and delete the channel', () => {
    cy.get(`.delete-${channelName}`).click();
    cy.intercept('DELETE', `${Cypress.env("REACT_APP_BASE_URL")}/channels/${channelName}`).as('deleteChannelCall');
    cy.get('#confirm').click();
    cy.wait('@deleteChannelCall');
    cy.get('.notification-container').contains(Constants.CHANNEL_DELETION_SUCCESS);
  });

  it('Confirm Channel Deletion should make call to stream provision URL and delete the channel', () => {
    cy.get(`.delete-${channelNameAbr}_1`).click();
    cy.intercept(
      'DELETE',
      `https://${Cypress.env("REACT_APP_STREAM_MANAGER_URL")}/streammanager/api/4.0/admin/event/meta/live/${channelNameAbr}_1?accessToken=${Cypress.env("REACT_APP_ACCESS_TOKEN")}`
    ).as('deleteProvision');
    cy.intercept('DELETE', `${Cypress.env("REACT_APP_BASE_URL")}/channels/${channelNameAbr}_1`).as('deleteChannelCall');
    cy.get('#confirm').click();
    cy.wait('@deleteProvision');
    cy.wait('@deleteChannelCall');
    cy.get('.notification-container').contains(Constants.CHANNEL_DELETION_SUCCESS);
  });
});
