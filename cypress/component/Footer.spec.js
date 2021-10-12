import React from 'react';
import { mount } from '@cypress/react';
import Footer from '../../src/components/Footer';

describe('Footer component should', () => {
  it('Footer component, should render version text', () => {
    mount(<Footer />);
    cy.contains('v0.1.');
  });

  it('Footer component, should have CSS property bottom: 0', () => {
    mount(<Footer />);
    cy.get('.footer-container').should('have.css', 'bottom', '0px');
  });

  it('Footer component, should have centered content', () => {
    mount(<Footer />);
    cy.get('.footer-container').should('have.css', 'justify-content', 'center');
  });
});
