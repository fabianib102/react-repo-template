import React from 'react';
import { mount } from '@cypress/react';
import NewChannelModal from '../../src/components/NewChannelModal';
import { LoaderContext } from '../../src/context/LoaderContext';
import Constants from '../../src/assets/utils/Constants';

const channelTest = { id: 'channelmock', channelName: 'channelMock', hasAbr: false };
let setLoadingStub;
let shownotificationStub;
let onSuccessCreateChannelStub;

describe('NewChannelModal component should', () => {
  beforeEach(() => {
    setLoadingStub = cy.stub();
    shownotificationStub = cy.stub();
    onSuccessCreateChannelStub = cy.stub();
    mount(<NewChannelModal show={true} shownotification={shownotificationStub} onSuccessCreateChannel={onSuccessCreateChannelStub} />);
  });

  it('formAbr checkbox should be correctly rendered', () => {
    cy.contains(`CREATE NEW ${Constants.CHANNEL_LABEL.toUpperCase()}`);
    cy.contains('Has ABR');
    cy.get('input[type="checkbox"]').should('have.css', 'display', 'inline-block');
    cy.get('input[type="checkbox"]')
      .should('have.css', 'width')
      .and('match', /^[17|18]/);
    cy.get('input[type="checkbox"]')
      .should('have.css', 'height')
      .and('match', /^[17|18]/);
  });

  it('formAbr checkbox should be toggleable', () => {
    cy.get('#formAbr').click();
    cy.get('#formAbr').should('be.checked');
    cy.get('#formAbr').click();
    cy.get('#formAbr').should('not.be.checked');
  });
});

describe('NewChannelModal component, using context, should', () => {
  beforeEach(() => {
    setLoadingStub = cy.stub();
    shownotificationStub = cy.stub();
    onSuccessCreateChannelStub = cy.stub();
    const props = { show: false, setIsLoading: setLoadingStub };
    mount(
      <LoaderContext.Provider value={{ ...props }}>
        <NewChannelModal show={true} shownotification={shownotificationStub} onSuccessCreateChannel={onSuccessCreateChannelStub} />
      </LoaderContext.Provider>
    );
    cy.intercept('POST', `${Cypress.env('REACT_APP_BASE_URL')}/channels`, { id: 55 });
  });

  it('Invoke setLoading function on create channel', () => {
    cy.get('#formName').type(channelTest.channelName);
    cy.get('#buttonCreateOk')
      .click()
      .should(() => {
        expect(setLoadingStub).to.be.called;
        expect(shownotificationStub).to.be.called;
        expect(onSuccessCreateChannelStub).to.be.called;
      });
  });

  it('Not invoke setLoading function on create channel and the form validator fails', () => {
    cy.get('#buttonCreateOk')
      .click()
      .should(() => {
        expect(setLoadingStub).not.to.be.called;
      });
  });
});
