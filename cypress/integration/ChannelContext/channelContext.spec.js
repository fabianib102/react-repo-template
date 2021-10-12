/// <reference types="cypress" />
import Constants from '../../../src/assets/utils/Constants';

describe('Test if the channel context is working correctly', () => {
  const channelName = String(Date.now());

  before(() => {
    cy.createTestChannel(channelName);
    cy.intercept(`/streammanager/api/4.0/event/live/${channelName}/stats`, {});
  });

  after(() => {
    cy.deleteTestChannel(channelName);
  });

  it('check that the channel name on the consumer side is equal to the created channel name', () => {
    cy.visit(`/${Constants.CONSUMER_APP_PATH}`);
    cy.contains(channelName).click();
    cy.get('#cancel').click();
    cy.get('.channel-name').contains(channelName);
  });
});
