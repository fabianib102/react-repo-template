import React from 'react';
import { mount } from '@cypress/react';
import Loader from '../../src/components/Loader';

describe('Loader component by default should', () => {
  it('Not render anything', () => {
    mount(<Loader />);
    cy.get('.loader').should('not.exist');
    cy.get('#spinner-loader').should('not.exist');
  });
});

describe('Loader component, with "show" parameter on true, should', () => {
  const Sut = () => {
    return <Loader show={true} />;
  };

  beforeEach(() => {
    mount(<Sut />);
  });

  it('Have a spinner element', () => {
    cy.get('#spinner-loader').should('exist');
  });

  const loaderBackgroundColor = 'rgba(200, 200, 200, 0.5)';
  it('Have background-color CSS property ', () => {
    cy.get('.loader').should('have.css', 'background-color', loaderBackgroundColor);
  });

  it('Have content centered ', () => {
    cy.get('.loader').should('have.css', 'align-items', 'center');
    cy.get('.loader').should('have.css', 'justify-content', 'center');
  });
});
