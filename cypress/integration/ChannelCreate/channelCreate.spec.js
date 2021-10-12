import Constants from '../../../src/assets/utils/Constants';
describe('Create New Channel procedure should', () => {
  const channelName = String(Date.now());
  before(() => {
    cy.createABRTestChannel(channelName);
  });

  after(() => {
    cy.deleteABRTestChannel(channelName);
  });

  beforeEach(() => {
    cy.mountCredentials();
  });

  it('enters to the recently created channel and verifies checkABR is checked if the channel has ABR', () => {
    cy.get(`a[href="/channel/${channelName}_1"]`).click();
    cy.get('#checkABR').should('be.checked');
  });

  it('Create a Channel with ABR calls the stream Provision', () => {
    const streamProvisionCheckChannel = String(Date.now());
    cy.intercept(
      `https://${Cypress.env("REACT_APP_STREAM_MANAGER_URL")}/streammanager/api/4.0/admin/event/meta/live/${streamProvisionCheckChannel}_1?accessToken=${Cypress.env("REACT_APP_ACCESS_TOKEN")}`
    ).as('streamProvisionCall');
    cy.intercept('POST', `${Cypress.env("REACT_APP_BASE_URL")}/channels`).as('createChannelCall');
    cy.get('#createButton').click();
    cy.get('#formName').type(streamProvisionCheckChannel);
    cy.get('#formAbr').check();
    cy.get('#buttonCreateOk').click();
    cy.wait('@streamProvisionCall');
    cy.wait('@createChannelCall');
    cy.get('.notification-container').contains(Constants.CHANNEL_CREATION_SUCCESS);
    cy.clearStreamProvision(streamProvisionCheckChannel);
    cy.deleteABRTestChannel(streamProvisionCheckChannel);
  });

  it('Create a Channel Failure Shows proper notification Toast', () => {
    cy.intercept(
      `https://${Cypress.env("REACT_APP_STREAM_MANAGER_URL")}/streammanager/api/4.0/admin/event/meta/live/${channelName}_1?accessToken=${Cypress.env("REACT_APP_ACCESS_TOKEN")}`,
      (req) => {
        req.destroy();
      }
    ).as('streamProvisionCall');
    cy.get('#createButton').click();
    cy.get('#formName').type(channelName);
    cy.get('#formAbr').check();
    cy.get('#buttonCreateOk').click();
    cy.get('.notification-container').contains(Constants.CHANNEL_CREATION_ERROR);
  });
});
