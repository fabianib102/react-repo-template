import React from 'react';
import { mount } from '@cypress/react';
import Container from '../../src/components/Container';

const fakeContent = <div />;

describe('Container component with content should', () => {
  it('be present', () => {
    mount(<Container content={fakeContent} />);
    cy.get('.general-container').should('exist');
  });
});
