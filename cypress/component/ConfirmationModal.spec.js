import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { mount } from '@cypress/react';
import ConfirmationModal from '../../src/components/ConfirmationModal';
import Constants from '../../src/assets/utils/Constants';

const modalBody = 'a modal body';

describe('Confirmation Modal component without parameters', () => {
  beforeEach(() => {
    mount(<ConfirmationModal title={`DELETE ${Constants.CHANNEL_LABEL.toUpperCase()} CONFIRMATION`} body={modalBody} />);
  });

  it('Should not be rendered by default', () => {
    cy.get('.modal').should('not.exist');
  });
});

describe('Confirmation Modal component with parameters and default props', () => {
  beforeEach(() => {
    mount(<ConfirmationModal title={`DELETE ${Constants.CHANNEL_LABEL.toUpperCase()} CONFIRMATION`} show body={modalBody} />);
  });

  it('If show parameter have value true, should be rendered', () => {
    cy.get('.modal-dialog').should('be.visible');
  });

  it('Contain modal title', () => {
    cy.contains(`DELETE ${Constants.CHANNEL_LABEL.toUpperCase()} CONFIRMATION`);
  });

  it('Contain modal body', () => {
    cy.contains(modalBody);
  });

  it('Confirm button is enabled by default', () => {
    cy.get('#confirm').should('be.enabled');
  });
});

describe('Confirmation Modal component with parameters and set props', () => {
  beforeEach(() => {
    mount(
      <ConfirmationModal title={`DELETE ${Constants.CHANNEL_LABEL.toUpperCase()} CONFIRMATION`} show body={modalBody} isConfirmEnabled={false} />
    );
  });

  it('Confirm button is disabled when the "isConfirmEnabled" attribute is false', () => {
    cy.get('#confirm').should('be.disabled');
  });
});
