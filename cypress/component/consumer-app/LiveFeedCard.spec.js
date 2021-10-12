import React from 'react';
import { mount } from '@cypress/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LiveFeedCard from '../../../src/components/consumer-app/LiveFeedCard';
import { getCurrentDate } from '../../../src/services/GeneralService';
import Constants from '../../../src/assets/utils/Constants';

const channelOffline = {
  id: 'channelname1',
  channelName: 'channelName1',
  createdOn: '1607522733704',
  date: getCurrentDate(),
  channelStatus: 'offline',
  ingestUrl: 'rtmp://saraza/live',
  protocol: 'webrtc',
};

const channelOnline = {
  id: 'channelname2',
  channelName: 'channelName2',
  createdOn: '1607522733707',
  date: getCurrentDate(),
  channelStatus: 'online',
  ingestUrl: 'rtmp://saraza/live',
  protocol: 'webrtc',
};

const swColor = 'rgb(252, 76, 2)';
const onlineColor = 'rgb(233, 25, 22)';

describe('LiveFeedCard Component should', () => {
  beforeEach(() => {
    mount(<LiveFeedCard channel={channelOffline} />);
  });

  it('Renders correctly on the screen', () => {
    cy.get('@LiveFeedCard').its('type').should('equal', LiveFeedCard);
  });

  it('Have fixed height of 290px', () => {
    cy.get('.livefeed-card').should('have.css', 'height', '290px');
  });

  it('Contains an image', () => {
    cy.get('@LiveFeedCard').get('img').should('be.visible');
  });

  it('Have southworks orange color', () => {
    cy.get('.title').should('have.css', 'color', swColor);
  });

  it('Have font-size equals to 15px', () => {
    cy.get('.title').should('have.css', 'font-size', '15px');
  });

  it('Have background color on the card body', () => {
    cy.get('.card-body').should('have.css', 'background-color', 'rgb(19, 50, 43)');
  });

  it('Have text-overflow css property on the title', () => {
    cy.get('.title').should('have.css', 'text-overflow', 'ellipsis');
  });

  it('Have a tag that shows the channel status', () => {
    cy.get('.channel-status').should('be.visible');
  });
});

describe('LiveFeedCard component with a channel offline should', () => {
  beforeEach(() => {
    mount(<LiveFeedCard channel={channelOffline} />);
  });

  it('Show "Offline" text on the status tag', () => {
    cy.get('.channel-status').contains(Constants.STATUS.OFFLINE.toUpperCase());
  });

  it('LiveFeedTitle matches with the channelName', () => {
    cy.get('.title').contains(channelOffline.channelName);
  });

  it('Have a tag with the southworks orange color on the background', () => {
    cy.get('.channel-status').should('have.css', 'background-color', swColor);
  });
});

describe('LiveFeedCard component with a channel online should', () => {
  beforeEach(() => {
    mount(<LiveFeedCard channel={channelOnline} />);
  });

  it('Show "Live" text on the status tag', () => {
    mount(<LiveFeedCard channel={channelOnline} />);
    cy.get('.channel-status').contains(Constants.STATUS.Live.toUpperCase());
  });

  it('LiveFeedTitle matches with the channelName', () => {
    cy.get('.title').contains(channelOnline.channelName);
  });

  it('Have a tag with the southworks orange color on the background', () => {
    cy.get('.channel-status').should('have.css', 'background-color', onlineColor);
  });
});
