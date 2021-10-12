import React from 'react';
import '../../src/assets/css/Styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { mount } from '@cypress/react';
import Conference from '../../src/components/conference/Conference';
import Constants from '../../src/assets/utils/Constants';
import { BrowserRouter } from 'react-router-dom';
import Red5ProService from '../../src/services/Red5ProService';
import Red5ProContext from '../../src/context/Red5ProServiceContext';
import AuthContext from '../../src/context/Auth';

describe('Conference component should', () => {
  let setEventCallbacksStub;

  const PreConferenceMock = () => {
    const { red5ProService } = Red5ProContext.useRed5Pro();
    setEventCallbacksStub = cy.stub().as('setEventCallbacksStub');
    cy.stub(red5ProService, 'conferenceConnection').value({
      setEventCallbacks: setEventCallbacksStub,
      sharedObject: {},
      participants: {},
    });
    return <></>;
  };

  const ConferenceWithRouter = () => {
    return (
      <BrowserRouter>
        <AuthContext.Provider>
          <Red5ProContext.Provider>
            <PreConferenceMock />
            <Conference />
          </Red5ProContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    cy.stub(Red5ProService.prototype, 'addHousekeeperMethodUpdateCallback');
    cy.stub(Red5ProService.prototype, 'leaveConference');
    cy.stub(Red5ProService.prototype, 'getCurrentStream').returns(null).as('getCurrentStream');
    cy.stub(Red5ProService.prototype, 'getStreamersList').returns([]).as('getStreamersList');
    mount(<ConferenceWithRouter />);
  });

  it('Render the component', () => {
    cy.get('@ConferenceWithRouter').its('type').should('equal', ConferenceWithRouter);
  });

  it('Have a header', () => {
    cy.get('.conference-header').should('be.visible');
  });

  it('Have a timer (not visible by default)', () => {
    cy.get('.timer').should('not.be.visible');
  });

  it('Have a main container', () => {
    cy.get('.conference-container').should('be.visible');
  });

  it('Have a quick actions panel', () => {
    cy.contains('Actions').should('be.visible');
  });

  it('Have a live feed panel', () => {
    cy.contains('Live Feed').should('be.visible');
  });

  it('Have a chat', () => {
    cy.contains(Constants.CHAT_ROOM).should('be.visible');
  });

  it('Invoke "getCurrentStream" of red5ProService', () => {
    cy.get('@getCurrentStream').should('have.been.called');
  });

  it('Invoke "getStreamList" of red5ProService', () => {
    cy.get('@getStreamersList').should('have.been.called');
  });

  it('Invoke setEventCallbacks to add proper callbacks to shared object', () => {
    cy.get('@setEventCallbacksStub').should('have.been.called');
  });
});
