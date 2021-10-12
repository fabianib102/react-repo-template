import React from 'react';
import { mount } from '@cypress/react';
import ParticipantsButton from '../../src/components/conference/participants/ParticipantsButton';

describe('Participants button component with an empty participants list should', () => {
  const participantsListEmpty = {};

  const red5ProService = {
    conferenceConnection: {},
  };

  const Sut = () => {
    return <ParticipantsButton participantsList={participantsListEmpty} red5ProService={red5ProService} />;
  };

  beforeEach(() => {
    red5ProService.addHousekeeperMethodUpdateCallback = cy.stub();
    mount(<Sut />);
  });

  it('Contains svg element', () => {
    cy.get('svg').should('be.visible');
  });

  it('Contains a button element', () => {
    cy.get('Button').should('be.visible');
  });

  it('Have its quantity indicator at 0', () => {
    cy.contains('0');
  });

  it('Not render the participants list', () => {
    cy.get('Button').click();
    cy.get('.list-group').should('not.exist');
  });

  it('Render a tooltip on button mouseover', () => {
    cy.get('Button').trigger('mouseover');
    cy.contains('Participants').should('be.visible');
  });
});

describe('Participants button component with participants list should', () => {
  const participantsList = {
    'User-1': { streamName: 'User-1' },
    'User-2': { streamName: 'User-2' },
  };

  const red5ProService = {
    conferenceConnection: {},
  };

  const Sut = () => {
    return <ParticipantsButton participantsList={participantsList} red5ProService={red5ProService} />;
  };

  beforeEach(() => {
    red5ProService.addHousekeeperMethodUpdateCallback = cy.stub();
    mount(<Sut />);
  });

  it('Render the amount participants', () => {
    cy.contains(Object.keys(participantsList).length);
  });

  it('Render a participants list on clicking', () => {
    cy.get('Button').click();
    cy.get('.list-group').should('be.visible');
  });
});
