import React from 'react';
import { mount } from '@cypress/react';
import ChannelRTMP from '../../src/components/ChannelRTMP';

describe('ChannelRTMP component should', () => {
  it('The component renders correctly', () => {
    mount(<ChannelRTMP channelId={'channel-id'}/>);
    cy.contains('Ingest Endpoint');
    cy.contains('Stream Key');
    cy.get('[id=input-group-ingest-endpoint]').then((e) => {
      const [dom] = e.get();
      expect(dom.querySelector('.form-control').value).to.be.equal('No endpoint selected');
    });
    cy.get('[id=input-group-stream-key]').then((e) => {
      const [dom] = e.get();
      expect(dom.querySelector('.form-control').value).to.be.equal('channel-id');
    });
  });

  it('the refresh icon-button should be visible by default', () => {
    mount(<ChannelRTMP />);
    cy.get('[id=refresh-rtmp]').should('be.visible');
  });
});
