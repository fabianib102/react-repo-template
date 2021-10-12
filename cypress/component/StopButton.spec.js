import React from 'react';
import { mount } from '@cypress/react';
import StopButton from '../../src/components/conference/participants/StopButton';

describe('Stop button component should', () => {
  let stopCoStreaming = () => {};

  const Sut = () => {
    return <StopButton stopCoStreaming={stopCoStreaming} />;
  };

  beforeEach(() => {
    stopCoStreaming = cy.stub();
    mount(<Sut />);
  });

  it('Contains a button element', () => {
    cy.get('Button').should('be.visible');
  });

  it('Contains svg element', () => {
    cy.get('svg').should('be.visible');
  });

  it('Render a tooltip on button mouseover', () => {
    cy.get('Button').trigger('mouseover');
    cy.contains('Stop Live Feed').should('be.visible');
  });

  it('Invoke "stopCoStreaming" method when the stop button is clicked', () => {
    cy.get('.stop-live-feed')
      .click()
      .should(() => {
        expect(stopCoStreaming).to.be.called;
      });
  });
});
