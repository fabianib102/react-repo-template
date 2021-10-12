import React from 'react';
import { mount, unmount } from '@cypress/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Constants from '../../../src/assets/utils/Constants';
import ConsumerConference from '../../../src/components/consumer-app/ConsumerConference';
import { BrowserRouter } from 'react-router-dom';
import Red5ProService from '../../../src/services/Red5ProService';
import Red5ProContext from '../../../src/context/Red5ProServiceContext';
import AuthContext from '../../../src/context/Auth';

describe('Consumer Conference Component should', () => {
  const ConsumerConferenceWithRouter = () => {
    return (
      <BrowserRouter>
        <AuthContext.Provider>
          <Red5ProContext.Provider>
            <ConsumerConference />
          </Red5ProContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    cy.stub(Red5ProService.prototype, 'addConnectionSuccessCallback').as('successCallback');
    cy.stub(Red5ProService.prototype, 'addConnectionFailureCallback').as('failureCallback');
    cy.stub(Red5ProService.prototype, 'addPropertyUpdateCallback').as('propertyUpdateCallback');
    cy.stub(Red5ProService.prototype, 'accessConference').as('accessConference');
    cy.stub(Red5ProService.prototype, 'leaveConference').as('leavingMethod');
    mount(<ConsumerConferenceWithRouter />);
    cy.get('#cancel').click();
  });

  it('Renders correctly on the screen', () => {
    cy.get('@ConsumerConferenceWithRouter').its('type').should('equal', ConsumerConferenceWithRouter);
  });

  it('Have a timer (not visible by default)', () => {
    cy.get('.timer').should('not.be.visible');
  });

  it('Have a open/close chat button', () => {
    cy.get('.floating-button').should('be.visible');
  });

  it('Have a tooltip on the open chat button', () => {
    cy.get('.floating-button').click().trigger('mouseover');
    cy.contains(Constants.CHAT_TOOLTIP_MESSAGE.EXPAND).should('be.visible');
  });

  it('Have a tooltip on the close chat button', () => {
    cy.get('.floating-button').trigger('mouseover');
    cy.contains(Constants.CHAT_TOOLTIP_MESSAGE.COLLAPSE).should('be.visible');
  });

  it('Have an actions panel', () => {
    cy.get('.consumer-actions').should('exist');
  });

  it('Display the viewers amount', () => {
    cy.get('.viewers').should('be.visible');
  });

  it('Display the channel name', () => {
    cy.get('.channel-name').should('be.visible');
  });

  it('Display the user name', () => {
    cy.get('.user').should('be.visible');
  });

  it('Invoke "addConnectionSuccessCallback" of red5ProService', () => {
    cy.get('@successCallback').should('have.been.called');
  });

  it('Invoke "addConnectionFailureCallback" of red5ProService', () => {
    cy.get('@failureCallback').should('have.been.called');
  });

  it('Invoke "addPropertyUpdateCallback" of red5ProService', () => {
    cy.get('@propertyUpdateCallback').should('have.been.called');
  });

  it('Invoke "accessConference" of red5ProService', () => {
    cy.get('@accessConference').should('have.been.called');
  });

  it('Invoke "leaveConference" on component unmount', () => {
    cy.get('@ConsumerConferenceWithRouter');
    unmount();
    cy.get('@leavingMethod').should('have.been.called');
  });

  it('Display the participant Id', () => {
    cy.get('.session-data .participant-name').should('not.be.empty');
  });
});

describe('Consumer Conference using the modal should', () => {
  const ConsumerConferenceWithRouter = () => {
    return (
      <BrowserRouter>
        <AuthContext.Provider>
          <Red5ProContext.Provider>
            <ConsumerConference />
          </Red5ProContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    cy.stub(Red5ProService.prototype, 'addConnectionSuccessCallback');
    cy.stub(Red5ProService.prototype, 'addConnectionFailureCallback');
    cy.stub(Red5ProService.prototype, 'addPropertyUpdateCallback');
    cy.stub(Red5ProService.prototype, 'accessConference');
    cy.stub(Red5ProService.prototype, 'leaveConference');
    cy.stub(Red5ProService.prototype, 'setStreamName').as('setStreamName');
    mount(<ConsumerConferenceWithRouter />);
  });

  it('contains a nickname if the user enters one', () => {
    cy.get('.form-control').type('nickname');
    cy.get('#confirm').click();
    cy.contains('nickname').click();
  });

  it('calls the setStreamName if the user clicks on the choose one for me button', () => {
    cy.get('.form-control').type('nickname');
    cy.get('#cancel').click();
    cy.get('@setStreamName').should('have.been.called');
  });
});
