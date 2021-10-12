import React from 'react';
import { streamManagerStreamScope, statsPath } from '../../src/services/red5pro.config';
import Timer from '../../src/components/conference/timer/Timer';
import { mount } from '@cypress/react';

describe('Timer component on exististing stream should', () => {
  beforeEach(() => {
    const testRoom = 'testRoom';
    cy.intercept(`${streamManagerStreamScope}/${testRoom}${statsPath}`, [{ startTime: Date.now() }]).as('getStartTime');
    mount(<Timer roomName={testRoom} />);
  });

  it('Renders correctly the component', () => {
    cy.wait('@getStartTime');
    cy.get('@Timer').its('type').should('equal', Timer);
  });

  it('Show the timer container', () => {
    cy.wait('@getStartTime');
    cy.get('@Timer').get('.timer').should('be.visible');
  });

  it('Have a background color: darkened secondary color', () => {
    cy.wait('@getStartTime');
    cy.get('#timer').should('have.css', 'background-color', 'rgb(12, 32, 27)');
  });
});

describe('Timer component on NON-existing stream should', () => {
  beforeEach(() => {
    const testRoom = 'testRoom';
    cy.intercept(`${streamManagerStreamScope}/${testRoom}${statsPath}`, { statusCode: 404, body: 'stream not found' }).as('getStartTime');
    mount(<Timer roomName={testRoom} />);
  });

  it('Renders correctly the component', () => {
    cy.wait('@getStartTime');
    cy.get('@Timer').its('type').should('equal', Timer);
  });

  it('Hide the timer container', () => {
    cy.wait('@getStartTime');
    cy.get('@Timer').get('.timer').should('not.be.visible');
  });
});
