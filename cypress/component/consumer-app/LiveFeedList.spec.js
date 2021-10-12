import React from 'react';
import { mount } from '@cypress/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LiveFeedList from '../../../src/components/consumer-app/LiveFeedList';
import { LoaderContext } from '../../../src/context/LoaderContext';

describe('LiveFeedList Component Tests', () => {
  beforeEach(() => {
    mount(<LiveFeedList />);
  });

  it('Renders correctly on the screen', () => {
    cy.get('@LiveFeedList').its('type').should('equal', LiveFeedList);
  });

  it('Be a flex container with wrap property', () => {
    cy.get('.livefeed-container').should('have.css', 'display', 'flex');
    cy.get('.livefeed-container').should('have.css', 'flex-wrap', 'wrap');
    cy.get('.livefeed-container').should('have.css', 'justify-content', 'center');
  });
});

describe('LiveFeedList Integration Tests', () => {
  let setIsLoadingStub;

  beforeEach(() => {
    const SutWithContext = (values) => {
      return (
        <LoaderContext.Provider value={values}>
          <LiveFeedList />
        </LoaderContext.Provider>
      );
    };
    setIsLoadingStub = cy.stub();
    const props = { show: false, setIsLoading: setIsLoadingStub };
    mount(<SutWithContext {...props} />);
  });

  it('Call the loader function', () => {
    cy.get('@SutWithContext').should(() => {
      expect(setIsLoadingStub).to.be.called;
    });
  });

  it('Perform the GET request /dev/channels when the component is initialized', () => {
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/channels`).as('getChannels');
    cy.wait('@getChannels');
  });
});
