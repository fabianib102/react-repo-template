import React from 'react';
import SubComponentHeader from '../../src/components/conference/SubComponentHeader';
import { mount } from '@cypress/react';

const testTitle = 'testTitle';

describe('SubComponentHeader component with visible header should', () => {
  beforeEach(() => {
    mount(<SubComponentHeader title={testTitle} showHeader />);
  });

  it('Render the component', () => {
    cy.get('@SubComponentHeader').its('type').should('equal', SubComponentHeader);
  });

  it('Have its properties well defined', () => {
    cy.get('@SubComponentHeader').its('props.title').should('deep.equal', testTitle);
  });

  it('Show the proper title', () => {
    cy.contains(testTitle).should('be.visible');
  });

  it('Have display:block CSS property', () => {
    cy.get('.sub-header').should('have.css', 'display', 'block');
  });

  it('Have a Row element with the "sub-header" className', () => {
    cy.get('.sub-header').should('be.visible');
  });
});

describe('SubComponentHeader component without visible header should', () => {
  beforeEach(() => {
    mount(<SubComponentHeader title={testTitle} />);
  });

  it('Not show the proper title if the showHeader attribute is false', () => {
    cy.contains(testTitle).should('not.be.visible');
  });

  it('Have display:none CSS property', () => {
    cy.get('.sub-header').should('have.css', 'display', 'none');
  });
});
