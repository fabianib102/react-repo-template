/// <reference types="cypress" />
import React from 'react';
import { mount } from '@cypress/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChannelService from '../../../src/services/ChannelService';
import Red5ProContext from '../../../src/context/Red5ProServiceContext';
import AuthContext from '../../../src/context/Auth';
import GridPreview from '../../../src/components/consumer-app/GridPreview';
import channelList from '../../fixtures/channelList';
import Constants from '../../../src/assets/utils/Constants';

const maxVideosInScreen = Constants.GRID_PREVIEW_MAX_VIDEOS_IN_SCREEN;

const testExpectedSize = (dimensionsToTest) => {
  const dimensions = {
    focused: [0, 0],
    notFocused: [0, 0],
    ...dimensionsToTest,
  }

  cy.get('.live-feed-wrapper').then(($allFeeds) => {
    const containerWidth = Cypress.$('.consumer-grid-preview').width();
    const containerHeight = Cypress.$('.consumer-grid-preview').height();

    $allFeeds.each((_, feed) => {
      const widthPercentageToUse = Cypress.$(feed).hasClass('focused') ? dimensions.focused[0] : dimensions.notFocused[0];
      const heightPercentageToUse = Cypress.$(feed).hasClass('focused') ? dimensions.focused[1] : dimensions.notFocused[1];
      const expectedWidth = parseInt(containerWidth * (widthPercentageToUse / 100));
      const expectedHeight = parseInt(containerHeight * (heightPercentageToUse / 100));

      let widthRegex = new RegExp(`${expectedWidth}`);
      let heightRegex = new RegExp(`${expectedHeight}`);
      if (!widthPercentageToUse || !heightPercentageToUse) {
        expect(feed).not.to.be.visible;
      } else {
        expect(feed).to.have.css('width').and.match(widthRegex);
        expect(feed).to.have.css('height').and.match(heightRegex);
      }
    });
  });
};

describe(`GridPreview with LESS than ${maxVideosInScreen} channels should`, () => {
  const threeChannels = channelList.filter((_, index) => index < 3)

  beforeEach(() => {
    cy.stub(ChannelService.prototype, 'getChannelsByStatus').returns({
      data: threeChannels,
      status: 200,
      statusText: 'OK',
    });

    mount(
      <AuthContext.Provider>
        <Red5ProContext.Provider>
          <GridPreview />
        </Red5ProContext.Provider>
      </AuthContext.Provider>
    );
  });

  it('Render as much videos as created channels', () => {
    cy.get('.live-feed-wrapper').should('have.length', threeChannels.length);
  });
});

describe(`GridPreview with MORE than ${maxVideosInScreen} channels should`, () => {
  beforeEach(() => {
    cy.stub(ChannelService.prototype, 'getChannelsByStatus').returns({
      data: channelList,
      status: 200,
      statusText: 'OK',
    });

    mount(
      <AuthContext.Provider>
        <Red5ProContext.Provider>
          <GridPreview />
        </Red5ProContext.Provider>
      </AuthContext.Provider>
    );
  });

  it(`Render ${maxVideosInScreen} videos even if there are more than ${maxVideosInScreen} channels`, () => {
    cy.get('.live-feed-wrapper').should('have.length', maxVideosInScreen);
  });
});

describe('1-9 feeds grid layout. GridPreview should', () => {
  const stubGetChannelsAndMount = (channelsAmount) => {
    cy.stub(ChannelService.prototype, 'getChannelsByStatus').returns({
      data: channelList.filter((_, index) => index < channelsAmount),
      status: 200,
      statusText: 'OK',
    });

    mount(
      <AuthContext.Provider>
        <Red5ProContext.Provider>
          <GridPreview />
        </Red5ProContext.Provider>
      </AuthContext.Provider>
    );
  }

  it('Mobile - Portrait - 1 to 3 feeds - SHOULD: Width: 100% / Height: 33.33%', () => {
    stubGetChannelsAndMount(1);
    cy.viewport('samsung-s10', 'portrait');
    testExpectedSize({ notFocused: [100, 33.33] });
  });

  it('Mobile - Portrait - 4 feeds - SHOULD: Width: 50% / Height: 50%', () => {
    stubGetChannelsAndMount(4);
    cy.viewport('samsung-s10', 'portrait');
    testExpectedSize({ notFocused: [50, 50] });
  });

  it('Mobile - Portrait - 5 to 6 feeds - SHOULD: Width: 50% / Height: 33.33%', () => {
    stubGetChannelsAndMount(6);
    cy.viewport('samsung-s10', 'portrait');
    testExpectedSize({ notFocused: [50, 33.33] });
  });

  it('Mobile - Portrait - 7 to 9 feeds - SHOULD: Width: 33.33% / Height: 33.33%', () => {
    stubGetChannelsAndMount(9);
    cy.viewport('samsung-s10', 'portrait');
    testExpectedSize({ notFocused: [33.33, 33.33] });
  });

  it('Mobile - Landscape - 1 feed - SHOULD: Width: 100% / Height: 100%', () => {
    stubGetChannelsAndMount(1);
    cy.viewport('samsung-s10', 'landscape');
    testExpectedSize({ notFocused: [100, 100] });
  });

  it('Mobile - Landscape - 2 feeds - SHOULD: Width: 50% / Height: 100%', () => {
    stubGetChannelsAndMount(2);
    cy.viewport('samsung-s10', 'landscape');
    testExpectedSize({ notFocused: [50, 100] });
  });

  it('Mobile - Landscape - 3 feeds - SHOULD: Width: 33.33% / Height: 100%', () => {
    stubGetChannelsAndMount(3);
    cy.viewport('samsung-s10', 'landscape');
    testExpectedSize({ notFocused: [33.33, 100] });
  });

  it('Mobile - Landscape - 4 feeds - SHOULD: Width: 50% / Height: 50%', () => {
    stubGetChannelsAndMount(4);
    cy.viewport('samsung-s10', 'landscape');
    testExpectedSize({ notFocused: [50, 50] });
  });

  it('Mobile - Landscape - 5 to 6 feeds - SHOULD: Width: 50% / Height: 33.33%', () => {
    stubGetChannelsAndMount(6);
    cy.viewport('samsung-s10', 'landscape');
    testExpectedSize({ notFocused: [50, 33.33] });
  });

  it('Mobile - Landscape - 7 to 9 feeds - SHOULD: Width: 33.33% / Height: 33.33%', () => {
    stubGetChannelsAndMount(9);
    cy.viewport('samsung-s10', 'landscape');
    testExpectedSize({ notFocused: [33.33, 33.33] });
  });

  it('Desktop - 1 feed - SHOULD: Width: 100% / Height: 100%', () => {
    stubGetChannelsAndMount(1);
    cy.viewport(1080, 720);
    testExpectedSize({ notFocused: [100, 100] });
  });

  it('Desktop - 2 feeds - SHOULD: Width: 50% / Height: 100%', () => {
    stubGetChannelsAndMount(2);
    cy.viewport(1080, 720);
    testExpectedSize({ notFocused: [50, 100] });
  });

  it('Desktop - 3 to 4 feeds - SHOULD: Width: 50% / Height: 50%', () => {
    stubGetChannelsAndMount(4);
    cy.viewport(1080, 720);
    testExpectedSize({ notFocused: [50, 50] });
  });

  it('Desktop - 5 to 6 feeds - SHOULD: Width: 33.33% / Height: 50%', () => {
    stubGetChannelsAndMount(6);
    cy.viewport(1080, 720);
    testExpectedSize({ notFocused: [33.33, 50] });
  });

  it('Desktop - 7 to 9 feeds - SHOULD: Width: 33.33% / Height: 33.33%', () => {
    stubGetChannelsAndMount(9);
    cy.viewport(1080, 720);
    testExpectedSize({ notFocused: [33.33, 33.33] });
  });
});

describe(`Focus/pin feed to see it bigger. GridPreview should`, () => {
  beforeEach(() => {
    cy.stub(ChannelService.prototype, 'getChannelsByStatus').returns({
      data: channelList,
      status: 200,
      statusText: 'OK',
    });

    mount(
      <AuthContext.Provider>
        <Red5ProContext.Provider>
          <GridPreview />
        </Red5ProContext.Provider>
      </AuthContext.Provider>
    );
  });

  it('Should show a "go to full screen" icon in every feed (if none is focused)', () => {
    cy.get('.live-feed-wrapper .live-feed-icons svg').then(($allFeedIcons) => {
      $allFeedIcons.each((_, icon) => {
        expect(Cypress.$(icon).hasClass('focus-feed-button')).to.be.true;
      });
    });
  });

  it('Should show a "exit full screen" icon only in the focused feed (if one is focused)', () => {
    cy.get('.live-feed-wrapper').first().find('.live-feed-icons svg').click();
    cy.get('.live-feed-wrapper .live-feed-icons svg').then(($allFeedIcons) => {
      $allFeedIcons.each((_, icon) => {
        if (Cypress.$(icon).parent().parent().hasClass('focused')) {
          expect(Cypress.$(icon).hasClass('unfocus-feed-button')).to.be.true;
        } else {
          expect(Cypress.$(icon).hasClass('focus-feed-button')).to.be.true;
        }
      });
    });
  });

  it(`Desktop - SHOULD: Width: 100% (focused) and 12.5% (not focused) / Height: 80% (focused) and 20% (not focused)`, () => {
    cy.viewport(1080, 720);
    cy.get('.live-feed-wrapper').first().find('.live-feed-icons svg').click();
    testExpectedSize({ focused: [100, 80], notFocused: [12.5, 20] });
  });

  it(`Mobile - SHOULD: show only the focused event with Width: 100% / Height: 100%`, () => {
    cy.viewport('samsung-s10', 'portrait');
    cy.get('.live-feed-wrapper').first().find('.live-feed-icons svg').click();
    testExpectedSize({ focused: [100, 100] });
  });
});
