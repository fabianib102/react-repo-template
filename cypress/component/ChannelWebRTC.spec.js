import React from 'react';
import '../../src/assets/css/Styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { mount } from '@cypress/react';
import Red5ProService from '../../src/services/Red5ProService';
import ChannelWebRTC from '../../src/components/ChannelWebRTC';
import Constants from '../../src/assets/utils/Constants';

const origin = {
  serverAddress: '1.1.1.1',
  scope: 'live',
};

const red5ProService = new Red5ProService();
const onUnpublishSuccessStub = () => {};
const onPublishedSuccessStub = () => {};
const onPublishingStub = () => {};
const onPublishedFailedStub = () => {};
const setIsLoadingResourcesStub = () => {};
const channelWithoutAbr = { id: 'stream-name', hasAbr: false };
const channelWithAbr = { ...channelWithoutAbr, hasAbr: true };
const credentialsResponse = { jwt: 'header.payload.signature' };

describe('ChannelWebRTC component should', () => {
  let showNotificationStub = () => {};
  const mountChannel = () =>
    mount(
      <ChannelWebRTC
        channel={channelWithoutAbr}
        red5ProService={red5ProService}
        onUnpublishedSuccess={onUnpublishSuccessStub}
        setIsLoadingResources={setIsLoadingResourcesStub}
        shownotification={showNotificationStub}
        onPublishedSuccess={onPublishedSuccessStub}
        onPublishedFailed={onPublishedFailedStub}
        onPublishing={onPublishingStub}
        streamId={channelWithoutAbr.id}
      />
    );

  beforeEach(() => {
    cy.stub(red5ProService, 'initPublisher');
    cy.stub(red5ProService, 'initConference');
    cy.stub(red5ProService, 'publish');
    cy.stub(red5ProService, 'unpublish');
    cy.stub(red5ProService, 'addPublisherEventCallback');
    cy.stub(red5ProService, 'setOriginEndpoint').returns(origin);
    cy.stub(red5ProService, 'setTranscoderEndpoint').returns(origin);
    cy.stub(red5ProService, 'setAuthParams').as('setAuthParams');
    cy.intercept('POST', `${Cypress.env('REACT_APP_BASE_URL')}/channels/${channelWithoutAbr.id}/credentials`, credentialsResponse);
  });

  it('Not be empty', () => {
    mountChannel();
    cy.get('@ChannelWebRTC').should('not.be.empty');
  });

  it('Render START CONFERENCE button', () => {
    mountChannel();
    cy.contains(`START ${Constants.CHANNEL_LABEL.toUpperCase()}`);
  });

  it('Contains selector with available camera devices', () => {
    mountChannel();
    cy.get('[id="camera-selector"]');
  });

  it('Contains select with available renditions', () => {
    mountChannel();
    cy.get('[id="rendition-selector"]');
  });

  it('Invoke showNotifications', () => {
    showNotificationStub = cy.stub();
    mountChannel();
    cy.get('@ChannelWebRTC').should(() => expect(showNotificationStub).to.be.called);
  });

  it('Invoke initPublisher with any channel', () => {
    mountChannel();
    cy.get('@ChannelWebRTC').should(() => expect(red5ProService.initPublisher).to.be.called);
  });

  it('Invoke publish when clicking START CONFERENCE', () => {
    mountChannel();
    cy.get('#startButton').click({ force: true });
    cy.get('@ChannelWebRTC').should(() => expect(red5ProService.publish).to.be.called);
  });

  it('Invoke addPublisherEventCallback when clicking START CONFERENCE', () => {
    mountChannel();
    cy.get('#startButton').click({ force: true });
    cy.get('@ChannelWebRTC').should(() => expect(red5ProService.addPublisherEventCallback).to.be.called);
  });

  it('Call setAuthParams passing the new JWT as input parameter', () => {
    mountChannel();
    cy.get('@setAuthParams').should('have.been.calledWith', credentialsResponse.jwt);
  });
});

describe('ChannelWebRTC component with ABR should', () => {
  let showNotificationStub = () => {};
  const mountChannelWithABR = () =>
    mount(
      <ChannelWebRTC
        channel={channelWithAbr}
        red5ProService={red5ProService}
        streamId={channelWithoutAbr.id}
        onUnpublishedSuccess={onUnpublishSuccessStub}
        shownotification={showNotificationStub}
        setIsLoadingResources={setIsLoadingResourcesStub}
        onPublishing={onPublishedSuccessStub}
        onPublishedSuccess={onPublishedSuccessStub}
        onPublishedFailed={onPublishedFailedStub}
        streamId={channelWithAbr.id}
      />
    );

  beforeEach(() => {
    cy.stub(red5ProService, 'initPublisher');
    cy.stub(red5ProService, 'setOriginEndpoint').returns(origin);
    cy.stub(red5ProService, 'setTranscoderEndpoint').returns(origin);
    cy.stub(red5ProService, 'initConference');
    cy.stub(red5ProService, 'setAuthParams');
    cy.intercept('POST', `${Cypress.env('REACT_APP_BASE_URL')}/channels/${channelWithoutAbr.id}/credentials`, credentialsResponse);
  });

  it('Invoke setTranscoderEndpoint and setOriginEndpoint', () => {
    mountChannelWithABR();
    cy.get('@ChannelWebRTC').should(() => expect(red5ProService.setOriginEndpoint).to.be.called);
    cy.get('@ChannelWebRTC').should(() => expect(red5ProService.setTranscoderEndpoint).to.be.called);
  });

  it('Notify an error when is not able to retrieve a node', () => {
    showNotificationStub = cy.stub();
    red5ProService.setTranscoderEndpoint = cy.stub(() => {
      throw new Error();
    });
    mountChannelWithABR();
    cy.get('@ChannelWebRTC').should(() =>
      expect(showNotificationStub).to.be.calledWith(Constants.ERROR, Constants.ORIGIN_REQUEST_ERROR, Constants.WEBRTC_PROTOCOL)
    );
  });
});

describe('ChannelWebRTC component without ABR should', () => {
  let showNotificationStub = () => {};
  const mountChannelWithoutABR = () =>
    mount(
      <ChannelWebRTC
        channel={channelWithoutAbr}
        red5ProService={red5ProService}
        onUnpublishedSuccess={onUnpublishSuccessStub}
        setIsLoadingResources={setIsLoadingResourcesStub}
        shownotification={showNotificationStub}
        onPublishedSuccess={onPublishedSuccessStub}
        onPublishing={onPublishingStub}
        onPublishedFailed={onPublishedFailedStub}
        streamId={channelWithoutAbr.id}
      />
    );

  beforeEach(() => {
    cy.stub(red5ProService, 'setOriginEndpoint').returns(origin);
    cy.stub(red5ProService, 'setTranscoderEndpoint').returns(origin);
    cy.stub(red5ProService, 'initConference');
    cy.stub(red5ProService, 'setAuthParams');
    cy.intercept('POST', `${Cypress.env('REACT_APP_BASE_URL')}/channels/${channelWithoutAbr.id}/credentials`, credentialsResponse);
  });

  it('Invoke setOriginEndpoint', () => {
    mountChannelWithoutABR();
    cy.get('@ChannelWebRTC').its('props').should('be.not.empty');
    cy.get('@ChannelWebRTC').should(() => expect(red5ProService.setOriginEndpoint).to.be.called);
    cy.get('@ChannelWebRTC').should(() => expect(red5ProService.setTranscoderEndpoint).not.to.be.called);
  });

  it('Notify an error when is not able to retrieve a node', () => {
    showNotificationStub = cy.stub();
    red5ProService.setOriginEndpoint = cy.stub(() => {
      throw new Error();
    });
    mountChannelWithoutABR();
    cy.get('@ChannelWebRTC').should(() =>
      expect(showNotificationStub).to.be.calledWith(Constants.ERROR, Constants.ORIGIN_REQUEST_ERROR, Constants.WEBRTC_PROTOCOL)
    );
  });
});
