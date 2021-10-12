import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../src/assets/css/Styles.scss';
import Infrastructure from '../../../src/components/infrastructure/Infrastructure';
import { mount } from '@cypress/react';

describe('Infrastructure component should', () => {
  beforeEach(() => {
    mount(<Infrastructure />);
  });

  it('Renders correctly the component', () => {
    cy.get('@Infrastructure').its('type').should('equal', Infrastructure);
  });

  it('Have a Card', () => {
    cy.get('.card').should('be.visible');
  });

  it('Have a Card header with title', () => {
    cy.get('.card-header').should('contain', 'Stream Manager Id:');
  });

  it('Have a Card Body with attributes', () => {
    cy.get('.card-body').should('contain', 'Instance Type:');
    cy.get('.card-body').should('contain', 'Availability Zone:');
    cy.get('.card-body').should('contain', 'Public Ip:');
  });

  it('Have 2 Buttons inside the card', () => {
    cy.get('.card').get('button').should('have.length', 2);
  });

  it('Show a Spinner when clicking refresh button', () => {
    cy.get('#refresh').click();
    cy.get('.spinner-border').should('be.visible');
  });

  it('Have a Table', () => {
    cy.get('.table').should('be.visible');
  });

  it('Have a Table Header with titles', () => {
    cy.get('thead').should('contain','#');
    cy.get('thead').should('contain','Type');
    cy.get('thead').should('contain','IP Address');
    cy.get('thead').should('contain','Status');
  });
});
