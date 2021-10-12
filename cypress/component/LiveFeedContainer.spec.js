import React from 'react';
import '../../src/assets/css/Styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import LiveFeedContainer from '../../src/components/conference/liveFeed/LiveFeedContainer';
import { mount } from '@cypress/react';
import Constants from '../../src/assets/utils/Constants';

describe('LiveFeedContainer component should', () => {
  const title = 'Live Feed';
  const littleStreamerSize = {
    height: 100,
    width: 178,
  };

  const liveFeedOverrideStyles = {
    height: 'calc(100vh - 180px)',
  };

  const getContainerSize = () => {
    let size = {
      width: 0,
      height: 0,
    };
    cy.get('.live-feed-container').then(($element) => {
      size.width = Math.floor($element.outerWidth());
      size.height = Math.floor($element.outerHeight());
    });

    return size;
  };

  const mountWithFeeds = (n, shareScreen) => {
    const streamersList = [
      { streamName: 'User-1', action: Constants.STREAM_ACTIONS.PUBLISH },
      { streamName: 'User-2', action: Constants.STREAM_ACTIONS.PUBLISH },
      { streamName: 'User-3', action: Constants.STREAM_ACTIONS.SCREEN_SHARE },
    ];
    if (n === 2 && shareScreen) streamersList[1].action = Constants.STREAM_ACTIONS.SCREEN_SHARE;
    const streamsToMount = streamersList.slice(0, n);
    mount(<LiveFeedContainer videoSource={[]} streamList={streamsToMount} liveFeedOverrideStyles={liveFeedOverrideStyles} showHeader={true} />);
  };

  it('Renders correctly the component', () => {
    mountWithFeeds(0);
    cy.get('@LiveFeedContainer').its('type').should('equal', LiveFeedContainer);
  });

  it('Have a header with "LiveFeedContainer" title', () => {
    mountWithFeeds(0);
    cy.contains(title).should('be.visible');
  });

  it('Have a Row to place inner content with the "row-sub-header" className', () => {
    mountWithFeeds(0);
    cy.get('.row-sub-header').should('be.visible');
  });

  it('Have an element with a message when no feeds', () => {
    mountWithFeeds(0);
    cy.get('.offline-message-container').should('exist');
    cy.get('.offline-message-container').contains(Constants.OFFLINE_STREAMING_MESSAGE);
  });

  it('Display the stream in full size', () => {
    mountWithFeeds(1);
    let containerSize = getContainerSize();
    cy.get('.live-feed').then(($element) => {
      const elementWidth = Math.floor($element.outerWidth());
      expect(elementWidth).to.equal(containerSize.width - 2);
    });
  });

  it('Display both of the streams with width 50% and height 100%', () => {
    mountWithFeeds(2);
    const containerSize = getContainerSize();
    cy.get('.live-feed')
      .eq(0)
      .then(($element) => {
        const elementWidth = Math.floor($element.outerWidth());
        const elementHeight = Math.floor($element.outerHeight());
        const expectedWidth = containerSize.width / 2 - 1;
        const expectedHeight = containerSize.height - 2;
        expect(elementWidth).to.equal(expectedWidth);
        expect(elementHeight).to.equal(expectedHeight);
      });
  });

  it('Display screen share according to layout when there are two streams', () => {
    mountWithFeeds(2, true);
    const containerSize = getContainerSize();
    cy.get('#screen-share').then(($element) => {
      const elementWidth = Math.floor($element.outerWidth());
      const elementHeight = Math.floor($element.outerHeight());
      const expectedWidth = containerSize.width - 2;
      const expectedHeight = containerSize.height - littleStreamerSize.height - 2;
      expect(elementWidth).to.equal(expectedWidth);
      expect(elementHeight).to.equal(expectedHeight);
    });
  });

  it('Display screen share according to layout when there are three streams', () => {
    mountWithFeeds(3);
    const containerSize = getContainerSize();
    cy.get('#screen-share').then(($element) => {
      const elementWidth = Math.floor($element.outerWidth());
      const elementHeight = Math.floor($element.outerHeight());
      const expectedWidth = containerSize.width - 2;
      const expectedHeight = containerSize.height - littleStreamerSize.height - 2;
      expect(elementWidth).to.equal(expectedWidth);
      expect(elementHeight).to.equal(expectedHeight);
    });
  });

  it('Display screen share according to layout when there are three streams according to layout', () => {
    mountWithFeeds(3);
    cy.get('.live-feed:not(#screen-share)').then(($streamers) => {
      const expectedWidth = littleStreamerSize.width;
      const expectedHeight = littleStreamerSize.height;
      $streamers.each((_, streamer) => {
        const elementWidth = Math.floor(Cypress.$(streamer).outerWidth());
        const elementHeight = Math.floor(Cypress.$(streamer).outerHeight());
        expect(elementWidth).to.equal(expectedWidth);
        expect(elementHeight).to.equal(expectedHeight);
      });
    });
  });

  it('Screen share feed should be rendered always as a first child', () => {
    mountWithFeeds(3);
    cy.get('.live-feed').first().should('have.attr', 'id', 'screen-share');
  });
});
