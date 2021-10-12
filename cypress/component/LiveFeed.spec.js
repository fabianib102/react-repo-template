import React from 'react';
import LiveFeed from '../../src/components/conference/liveFeed/LiveFeed';
import Constants from '../../src/assets/utils/Constants';
import { mount } from '@cypress/react';

describe('LiveFeed component should', () => {
  const streamName = 'test-stream';
  const mediaSteam = new MediaStream();
  const screenShare = 'screen-share'

  const mountLiveFeedForPublisher = () => {
    mount(<LiveFeed id="test-id" type={Constants.PUBLISHER} src={mediaSteam} />);
  };

  const mountLiveFeedForSubscription = () => {
    mount(<LiveFeed id="test-id" type={Constants.SUBSCRIBER} src={streamName} />);
  };

  const mountLiveFeedForSubscriptionToScreenShare = () => {
    mount(<LiveFeed id={screenShare} type={Constants.SUBSCRIBER} src={streamName} />);
  };

  it('Render correctly the component', () => {
    mountLiveFeedForSubscription();
    cy.get('@LiveFeed').its('type').should('equal', LiveFeed);
  });

  it('Append a video element if type is publisher', () => {
    mountLiveFeedForPublisher();
    cy.get('@LiveFeed').get('video').should('be.visible');
  });

  it('Attach the mediaStream to the video element if type is publisher', () => {
    mountLiveFeedForPublisher();
    cy.get('@LiveFeed')
      .get('video')
      .should((element) => {
        const [dom] = element.get();
        expect(dom.srcObject).to.equal(mediaSteam);
      });
  });

  it('Append an Red5ProSubscriber component if the type is subscriber', () => {
    mountLiveFeedForSubscription();
    cy.get('@LiveFeed').get('.red5pro-subscriber').should('be.visible');
  });

  it('Set the correct id to the Red5ProSubscriber component', () => {
    mountLiveFeedForSubscription();
    cy.get('@LiveFeed').get('video').should('have.attr', 'id', streamName);
  });

  it('Set the "screen-share" id to a Red5ProSubscriber component that is a Screen Sharing', () => {
    mountLiveFeedForSubscriptionToScreenShare();
    cy.get('@LiveFeed').get('.red5pro-subscriber').should('have.attr', 'id', screenShare);
  });
});
