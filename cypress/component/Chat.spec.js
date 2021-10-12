import React from 'react';
import Chat from '../../src/components/conference/chat/Chat';
import Constants from '../../src/assets/utils/Constants';
import { mount } from '@cypress/react';

const streamName = 'test';
const nickName = 'test-name';
const customClass = 'custom-class';
const title = Constants.CHAT_ROOM;

describe('Chat component with header should', () => {
  beforeEach(() => {
    mount(<Chat streamName={streamName} showHeader nickName={nickName} headerClassName="custom-class" />);
  });

  it('Renders correctly the component', () => {
    cy.get('@Chat').its('type').should('equal', Chat);
  });

  it('Have its properties well defined', () => {
    cy.get('@Chat').its('props.streamName').should('deep.equal', streamName);
  });

  it('Have a header with "Conference Chat" title', () => {
    cy.contains(title).should('be.visible');
  });

  it('Have a Row to place inner content with the "row-sub-header" className', () => {
    cy.get('.row-sub-header').should('be.visible');
  });

  it('Apply custom-class to component header', () => {
    cy.get('.sub-header').should('have.class', customClass);
  });

  it('Have an iframe with the src pointing to the Chat App', () => {
    cy.get('iframe').should(
      'have.attr',
      'src',
      `${Cypress.env('REACT_APP_EMBEDDABLE_PLAYER_URL')}/${Constants.CHAT_PATH}/${Constants.QUERY}${streamName}&${
        Constants.NICKNAME_QUERY
      }${nickName}`
    );
  });
});

describe('Chat component without header should', () => {
  beforeEach(() => {
    mount(<Chat streamName={streamName} />);
  });

  it('Not have to show a header if the showHeader attribute is false', () => {
    cy.contains(title).should('not.be.visible');
  });
});
