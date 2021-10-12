import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChannelsTable from '../../src/components/ChannelsTable';
import { mount } from '@cypress/react';
import { BrowserRouter } from 'react-router-dom';
import { LoaderContext } from '../../src/context/LoaderContext';
import Constants from '../../src/assets/utils/Constants';
import data from '../fixtures/channelList.json';

const testChannelId = data[0].id;

describe('ChannelsTable component should', () => {
  const Sut = () => {
    return (
      <BrowserRouter>
        <ChannelsTable data={data} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mount(<Sut />);
  });

  it('Have a table that contains 3 visible columns', () => {
    cy.contains(Constants.CHANNEL_LABEL).should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('Action').should('be.visible');
  });

  it('Contain svg elements on the "Action" column', () => {
    cy.get(`svg.delete-${testChannelId}.table-icon`).should('be.visible');
    cy.get(`svg.invitation-icon.table-icon`).should('be.visible');
  });

  it('Open a modal when clicking on send invitation action', () => {
    cy.get('.invitation-icon.table-icon').first().click();
    cy.contains('Send Invitation');
    cy.contains('Email');
    cy.contains('SMS');
  });
});

describe('ChannelsTable component, using context, should', () => {
  let setLoadingStub;
  let shownotificationStub;
  let onDeleteChannelStub;
  let onJoinConferenceStub;
  const fakeEmails = 'emailOne@gmail.com, emailTwo@gmail.com';
  const fakeCellphones = '3434343434, 7787857858';

  beforeEach(() => {
    setLoadingStub = cy.stub();
    shownotificationStub = cy.stub();
    onDeleteChannelStub = cy.stub();
    onJoinConferenceStub = cy.stub();
    const props = { isLoading: false, setIsLoading: setLoadingStub };
    mount(
      <LoaderContext.Provider value={{ ...props }}>
        <BrowserRouter>
          <ChannelsTable
            data={data}
            shownotification={shownotificationStub}
            onDeleteChannel={onDeleteChannelStub}
            onJoinConference={onJoinConferenceStub}
          />
        </BrowserRouter>
      </LoaderContext.Provider>
    );
    cy.intercept('DELETE', `${Cypress.env('REACT_APP_BASE_URL')}/channels/${testChannelId}`, { id: 55 });
  });

  it('Invoke setLoading function on delete channel', () => {
    cy.get(`.delete-${testChannelId}.table-icon`).click();
    cy.get('#confirm')
      .click()
      .should(() => {
        expect(setLoadingStub).to.be.called;
        expect(shownotificationStub).to.be.called;
        expect(onDeleteChannelStub).to.be.called;
      });
  });

  it('Invoke shownotification function on send invitation was failed', () => {
    cy.intercept('POST', `${Cypress.env('REACT_APP_BASE_URL')}/channels/${testChannelId}/${Constants.SEND_INVITATION_ENDPOINT}`, {
      statusCode: 404,
      body: '',
    }).as('sendInvitationsError');
    cy.get('.invitation-icon.table-icon').first().click();
    cy.get('.user-email').type(fakeEmails);
    cy.get('.user-number').type(fakeCellphones);
    cy.get('#confirm')
      .click()
      .should(() => {
        expect(setLoadingStub).to.be.called;
        expect(shownotificationStub).to.be.calledWith(Constants.ERROR, Constants.SEND_INVITATION_ERROR, Constants.CHANNEL_ERROR);
      });
  });

  it('Invoke shownotification function on send invitation was success', () => {
    cy.intercept('POST', `${Cypress.env('REACT_APP_BASE_URL')}/channels/${testChannelId}/${Constants.SEND_INVITATION_ENDPOINT}`, { id: 55 });
    cy.get('.invitation-icon.table-icon').first().click();
    cy.get('.user-email').type(fakeEmails);
    cy.get('.user-number').type(fakeCellphones);
    cy.get('#confirm')
      .click()
      .should(() => {
        expect(setLoadingStub).to.be.called;
        expect(shownotificationStub).to.be.called;
        expect(shownotificationStub).to.be.calledWith(Constants.SUCCESS, Constants.SEND_INVITATION_SUCCESS);
      });
  });

  it('Have tooltips in send invitation modal', () => {
    cy.get('.invitation-icon.table-icon').first().click();
    cy.get('.info-icon').first().trigger('mouseover');
    cy.contains(Constants.SEND_INVITATION_TOOLTIP_MESSAGE.EMAILS).should('be.visible');
    cy.get('.info-icon').last().trigger('mouseover');
    cy.contains(Constants.SEND_INVITATION_TOOLTIP_MESSAGE.CELLPHONES).should('be.visible');
  });

  it('Have the confirm button disabled when the textareas are empty in send invitation modal', () => {
    cy.get('.invitation-icon.table-icon').first().click();
    cy.get('#confirm').should('be.disabled');
  });
});
