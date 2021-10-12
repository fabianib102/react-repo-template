import React from 'react';
import NumberOfViewers from '../../../src/components/consumer-app/NumberOfViewers';
import { mount } from '@cypress/react';
import Constants from '../../../src/assets/utils/Constants';

describe('Number of viewers component should', () => {
  const participantsListWithOneScreenSharing = ['User1', `User-2-${Constants.SCREEN_SHARE_PUBLISHER}`, 'User3', 'User4'];

  beforeEach(() => {
    mount(<NumberOfViewers participantsList={participantsListWithOneScreenSharing} />);
  });

  it('Renders correctly', () => {
    cy.get('@NumberOfViewers');
    cy.get('svg').should('be.visible');
  });

  it('Render the participants amount without the screen sharing', () => {
    cy.get('.viewers').contains('3');
  });
});
