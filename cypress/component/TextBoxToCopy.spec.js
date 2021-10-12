import React from 'react';
import TextBoxToCopy from '../../src/components/TextBoxToCopy';
import { mount } from '@cypress/react';

describe('TextBoxToCopy component should', () => {
  beforeEach(() => {
    mount(<TextBoxToCopy textValue="exampleText" tooltipHideTimeout={500} customId="id" />);
  });

  it('Contains input element', () => {
    cy.get('[id="input-group-id"]');
  });

  it('Input element is read-only', () => {
    cy.get('[id="input-group-id"] input').should('have.attr', 'readOnly');
  });

  it('Contains copy icon button', () => {
    cy.get('svg');
  });

  it("Copy Button shows 'Copied!'", () => {
    cy.get('svg').click();
    cy.contains('Copied!').should('be.visible');
  });

  it('Copy feature actually calls execCommand function', () => {
    cy.stub(document, 'execCommand');
    cy.get('svg').click();
    cy.document().its('execCommand').should('be.called');
  });

  it('Show tooltip when hovering over the button to copy the iframe', () => {
    cy.get('svg').trigger('mouseover');
    cy.contains('Copy to clipboard');
  });
});
