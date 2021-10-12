import React from 'react';
import { mount } from '@cypress/react';
import Header from '../../src/components/Header';
import { BrowserRouter } from 'react-router-dom';
import AuthContext from '../../src/context/Auth';

describe('Header component should', () => {
  const title = 'testing title';

  beforeEach(() => {
    mount(
      <AuthContext.Provider>
        <BrowserRouter>
          <Header title={title} />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });

  it('Render a title', () => {
    cy.contains(title);
  });

  it('Have an img element with CSS property height: 70px', () => {
    cy.get('img').should('have.css', 'height', '70px');
  });

  it('Have the CSS property height: 90px', () => {
    cy.get('.page-header').should('have.css', 'height', '90px');
  });

  it('Have the link to home seccion', () => {
    cy.get('a').should('have.attr', 'href');
  });

  it('Not display a title in mobile layout', () => {
    cy.viewport(767, 500);
    cy.get('.title').should('not.be.visible');
  });
});
