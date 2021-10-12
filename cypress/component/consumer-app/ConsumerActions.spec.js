import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConsumerActions from '../../../src/components/consumer-app/ConsumerActions';
import { mount } from '@cypress/react';

describe('Consumer actions component as a viewer should', () => {
  let updateStatus;

  beforeEach(() => {
    updateStatus = cy.stub();
    mount(<ConsumerActions updateAskedToJoinStatus={updateStatus} />);
  });

  it('Have an action button', () => {
    cy.get('button').should('have.length', '1');
  });

  it('Have an aks to join button by default', () => {
    cy.get('.ask-to-join').should('have.length', '1');
  });

  it('Render a tooltip on button mouseover', () => {
    cy.get('button').trigger('mouseover');
    cy.contains('Ask to Join').should('be.visible');
  });

  it('Invoke "updateAskedToJoinStatus" function clicking ask to join', () => {
    cy.get('.ask-to-join')
      .click()
      .should(() => {
        expect(updateStatus).to.be.called;
      });
  });
});

describe('Consumer actions component as a co-streamer should', () => {
  let stopCoStreaming;

  beforeEach(() => {
    stopCoStreaming = cy.stub();
    mount(<ConsumerActions isCoStreamer stopCoStreaming={stopCoStreaming} />);
  });

  it('Have an action button', () => {
    cy.get('button').should('have.length', '2');
  });

  it('Invoke "stopCoStreaming" function on stop co-streaming', () => {
    cy.get('.stop-live-feed')
      .click()
      .should(() => {
        expect(stopCoStreaming).to.be.called;
      });
  });

  it('Render a tooltip on button mouseover', () => {
    cy.get('.stop-live-feed').trigger('mouseover');
    cy.contains('Stop Live Feed').should('be.visible');
  });
});
