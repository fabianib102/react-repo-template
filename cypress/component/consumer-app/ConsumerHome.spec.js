import React from 'react';
import { mount } from '@cypress/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConsumerHome from '../../../src/components/consumer-app/ConsumerHome';

describe('ConsumerHome should', () => {
  beforeEach(() => {
    mount(<ConsumerHome />);
  });

  it('Renders correctly on the screen', () => {
    cy.get('@ConsumerHome').its('type').should('equal', ConsumerHome);
  });

  it('Contains the LIVESTREAM title', () => {
    cy.contains('LIVESTREAMS');
  });

  it('Have background-color CSS property ', () => {
    cy.get('.consumer-home').should('have.css', 'background-color', 'rgb(19, 50, 43)');
  });

  it('Have border-top that divides the header from the main container', () => {
    cy.get('.consumer-home').then(($consumerHomeElement) => {
      const roundedBorderTopWidth = Math.round(parseFloat($consumerHomeElement.css('border-top-width')));
      const borderStyle = $consumerHomeElement.css('border-top-style');
      const borderColor = $consumerHomeElement.css('border-top-color');
      expect(roundedBorderTopWidth).to.equal(1);
      expect(borderStyle).to.equal('solid');
      expect(borderColor).to.equal('rgb(252, 76, 2)');
    });
  });

  it('Perform the GET request /dev/channels when the component is initialized', () => {
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/channels`).as('getChannels');
    cy.wait('@getChannels');
  });
});
