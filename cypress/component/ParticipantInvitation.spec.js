import React from 'react';
import { mount } from '@cypress/react';
import ParticipantInvitation from '../../src/components/conference/participants/ParticipantInvitation';
import Constants from '../../src/assets/utils/Constants';

describe('ParticipantInvitation component without parameters should', () => {
  it('not be visible', () => {
    mount(<ParticipantInvitation />);
    cy.get('.modal-dialog').should('not.exist');
  });
});

describe('ParticipantInvitation component should', () => {
  let onAccept;
  let onReject;

  beforeEach(() => {
    onAccept = cy.stub();
    onReject = cy.stub();
    mount(<ParticipantInvitation showModal onCancel={onReject} onConfirm={onAccept} />);
  });

  it('be visible when show props is true', () => {
    cy.get('.modal-dialog').should('exist');
  });

  it('show the modal title', () => {
    cy.get('.modal-title').contains(Constants.INVITATION_MODAL.TITLE);
  });

  it('show the modal body', () => {
    cy.get('.modal-body').contains(Constants.INVITATION_MODAL.BODY);
  });

  it('show render close and accept button', () => {
    cy.get('.modal-footer button').should('have.length', '2');
  });

  it('call the close button', () => {
    cy.get('#cancel')
      .click()
      .should(() => {
        expect(onReject).to.be.called;
      });
  });

  it('call the accept button', () => {
    cy.get('#confirm')
    .click()
    .should(() => {
      expect(onAccept).to.be.called;
    });
  });
});