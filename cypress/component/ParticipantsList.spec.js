import React from 'react';
import { mount } from '@cypress/react';
import ParticipantsList from '../../src/components/conference/participants/ParticipantsList';
import Constants from '../../src/assets/utils/Constants';
import { ShowNotificationContext } from '../../src/context/ShowNotificationContext';

const assertButtonsDisabledStatus = (status) => {
  cy.get('.add-participant-button').then(($addParticipantButtons) => {
    $addParticipantButtons.each((_, button) => {
      expect(button.disabled).to.be[status];
    });
  });
}

describe('Participants list component with parameters (ONE streamer) should', () => {
  const participantsList = {
    'User-1': { streamName: 'User-1', status: Constants.PARTICIPANT_ROLES.VIEWERS, additionalData: { askedToJoin: true } },
    'User-2': { streamName: 'User-2', status: Constants.PARTICIPANT_ROLES.STREAMERS },
    'User-3': { streamName: 'User-3', status: Constants.PARTICIPANT_ROLES.VIEWERS },
    'User-4': { streamName: 'User-4', status: Constants.PARTICIPANT_ROLES.VIEWERS },
  };

  const red5ProService = {
    conferenceConnection: {},
  };

  const objectNotification = { show: false, message: '', type: Constants.SUCCESS };
  let setObjectNotification;
  const Sut = (props) => {
    return (
      <ShowNotificationContext.Provider value={props}>
        <ParticipantsList participants={participantsList} showList={true} red5ProService={red5ProService} />
      </ShowNotificationContext.Provider>
    );
  };

  beforeEach(() => {
    red5ProService.conferenceConnection.invokeMethodUpdate = cy.stub();
    red5ProService.addHousekeeperMethodUpdateCallback = cy.stub();
    setObjectNotification = cy.stub();
    const props = { objectNotification, setObjectNotification };
    mount(<Sut {...props} />);
  });

  it('Render each user on the list', () => {
    const participantsKeys = Object.keys(participantsList);
    participantsKeys.map((key) => cy.contains(participantsList[key].streamName));
  });

  it('Contains svg element', () => {
    cy.get('svg').should('be.visible');
  });

  it('Contains a button element', () => {
    cy.get('Button').should('be.visible');
  });

  it('Show all the add participant buttons disabled', () => {
    assertButtonsDisabledStatus('true');
  });

  it('Invoke invokeMethodUpdate method when cliking stop button from a participant', () => {
    cy.get('.stop-co-streaming-button')
      .first()
      .click()
      .should(() => {
        expect(red5ProService.conferenceConnection.invokeMethodUpdate).to.be.called;
      });
  });

  it('Invoke setObjectNotification method when cliking stop button from a participant', () => {
    cy.get('.stop-co-streaming-button')
      .first()
      .click()
      .should(() => {
        expect(setObjectNotification).to.be.called;
      });
  });

  it('Show a stop icon when the participant is a co-streamer', () => {
    cy.get('Button').should('have.class', 'stop-co-streaming-button');
  });

  it('Show a tooltip explaining the button is for stopping the stream of the co-streamer', () => {
    cy.get('.stop-co-streaming-button').first().trigger('mouseover');
    cy.contains('Stop co-streamer stream').should('be.visible');
  });

  it('Show one participant that has asked to join', () => {
    cy.get('.fa-hand-paper').should('have.length', 1);
  });
});

describe('Participants list component with parameters (NO streamers) should', () => {
  const participantsList = {
    'User-1': { streamName: 'User-1', status: Constants.PARTICIPANT_ROLES.VIEWERS },
    'User-2': { streamName: 'User-2', status: Constants.PARTICIPANT_ROLES.VIEWERS },
    'User-3': { streamName: 'User-3', status: Constants.PARTICIPANT_ROLES.VIEWERS },
  };

  const red5ProService = {
    conferenceConnection: {},
  };
  const objectNotification = { show: false, message: '', type: Constants.SUCCESS };
  let setObjectNotification;
  const Sut = (props) => {
    return (
      <ShowNotificationContext.Provider value={props}>
        <ParticipantsList participants={participantsList} showList={true} red5ProService={red5ProService} />
      </ShowNotificationContext.Provider>
    );
  };

  beforeEach(() => {
    red5ProService.conferenceConnection.invokeMethodUpdate = cy.stub();
    red5ProService.addHousekeeperMethodUpdateCallback = cy.stub();
    setObjectNotification = cy.stub();
    const props = { objectNotification, setObjectNotification };
    mount(<Sut {...props} />);
  });

  it('Invoke addHousekeeperMethodUpdateCallback method when being mounted', () => {
    expect(red5ProService.addHousekeeperMethodUpdateCallback).to.be.called;
  });

  it('Invoke invokeMethodUpdate method when clicking add participant button', () => {
    cy.get('.add-participant-button')
      .first()
      .click()
      .should(() => {
        expect(red5ProService.conferenceConnection.invokeMethodUpdate).to.be.called;
      });
  });

  it('Invoke setObjectNotification method when clicking add participant button', () => {
    cy.get('.add-participant-button')
      .first()
      .click()
      .should(() => {
        expect(setObjectNotification).to.be.called;
      });
  });

  it('Disable the invite participant buttons after being clicked', () => {
    assertButtonsDisabledStatus('false');
    cy.get('.add-participant-button').first().click();
    assertButtonsDisabledStatus('true');
  });

  it('Replace the clicked invite participant button', () => {
    assertButtonsDisabledStatus('false');
    cy.get('.add-participant-button').first().click().should('have.class', 'cancel-invitation');
  });

  it('Show a tooltip explaining the button is for inviting a participant', () => {
    cy.get('.add-participant-button').first().trigger('mouseover');
    cy.contains('Invite to co-stream').should('be.visible');
  });
});
