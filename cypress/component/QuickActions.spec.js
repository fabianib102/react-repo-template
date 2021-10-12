import React from 'react';
import QuickActions from '../../src/components/conference/quickActions/QuickActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import { mount } from '@cypress/react';

const participantsList = {
  'User-1': { streamName: 'User-1' },
  'User-2': { streamName: 'User-2' },
};

const red5ProService = {
  conferenceConnection: {},
  addEndedShareScreenEventCallback: () => {},
  addHousekeeperMethodUpdateCallback: () => {},
};

describe('QuickActions component test', () => {
  const title = 'Actions';

  beforeEach(() => {
    mount(<QuickActions participantsList={participantsList} red5ProService={red5ProService} shareScreenCallback={() => {}} />);
  });

  it('Renders correctly the component', () => {
    cy.get('@QuickActions').its('type').should('equal', QuickActions);
  });

  it('Have a header with "Actions" title', () => {
    cy.contains(title).should('be.visible');
  });

  it('Have a Row to place inner content with the "row-sub-header" className', () => {
    cy.get('.row-sub-header').should('be.visible');
  });

  it('Have two action buttons', () => {
    cy.get('button').should('have.length', '2');
  });

  it('Show a Stop Share Screen tooltip after clicking it', () => {
    cy.get('.share-screen-button').click();
    cy.get('#popover').contains('Stop Share Screen');
  });

  it('Show a Screen Share tooltip on mouse', () => {
    cy.get('.share-screen-button').trigger('mouseover');
    cy.get('#popover').contains('Screen Share');
  });

  it('Have the light orange background color', () => {
    cy.get('.share-screen-button').click().should('have.css', 'background-color', 'rgb(255, 176, 30)');
  });
});

describe('QuickActions integration test suite no. 1', () => {
  let shareScreenStub;

  beforeEach(() => {
    shareScreenStub = cy.stub();
    mount(<QuickActions participantsList={participantsList} red5ProService={red5ProService} shareScreenCallback={shareScreenStub} />);
  });

  it('Call the shareScreenStub method when press the ShareScreen button', () => {
    cy.get('.share-screen-button')
      .click()
      .should(() => {
        expect(shareScreenStub).to.be.called;
      });
  });
});

describe('QuickActions integration test suite no. 2', () => {
  let shareScreenStub;

  beforeEach(() => {
    shareScreenStub = cy.stub().rejects(new Error('foo'));
    mount(<QuickActions participantsList={participantsList} red5ProService={red5ProService} shareScreenCallback={shareScreenStub} />);
  });

  it('Call the shareScreenStub method when press the ShareScreen button', () => {
    cy.get('.share-screen-button')
      .click()
      .should(() => {
        expect(shareScreenStub).to.be.called;
      });
  });

  it('Should keep the initial tooltip after a failed operaiton', () => {
    cy.get('.share-screen-button').click();
    cy.get('#popover').contains('Screen Share');
  });

  it('Should keep the initial background color after a failed operation', () => {
    cy.get('.share-screen-button').click().should('not.have.css', 'background-color', 'rgb(255, 176, 30)');
  });
});
