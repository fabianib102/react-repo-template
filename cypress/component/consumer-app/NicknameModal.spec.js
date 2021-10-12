import React from 'react';
import { mount } from '@cypress/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NicknameModal from '../../../src/components/consumer-app/NicknameModal';

describe('NicknameModal Component Tests', () => {
  let setNickName = null;
  beforeEach(() => {
    setNickName = cy.stub();
    mount(<NicknameModal showModal setNickName={setNickName} />);
  });

  it('Renders correctly on the screen', () => {
    cy.get('@NicknameModal').its('type').should('equal', NicknameModal);
  });

  it('The access button should be disabled if the user doesnt enter a nickname', () => {
    cy.get('#confirm').should('be.disabled');
  });

  it('The access button should not be disabled if the user entered a nickname', () => {
    cy.get('.form-control').type('nickname');
    cy.get('#confirm').should('not.be.disabled');
  });

  it('Choose one for me button should be enabled', () => {
    cy.get('#cancel').should('not.be.disabled');
  });

  it('SetNickname function should be called if the user types a nickname', () => {
    cy.get('.form-control').type('nickname');
    cy.get().should(() => {
      expect(setNickName).to.be.called;
    });
  });
});
