import React from 'react';
import { mount } from '@cypress/react';
import ParticipantDeviceSettings from '../../src/components/consumer-app/ParticipantDeviceSettings';
import Constants from '../../src/assets/utils/Constants';

const currentDeviceConfiguration = {
  video: {
    deviceId: 'test-device',
  },
  audio: {
    deviceId: 'test-mic',
    label: 'Test Microphone',
  },
};
const videoDevices = [
  {
    id: 'test-video-1',
    name: 'name video one',
  },
  {
    id: 'test-video-2',
    name: 'name video two',
  },
];

const renditions = [
  {
    value: '320x240 (TEST)',
    disabled: false,
    w: 320,
    h: 240,
  },
  {
    value: '640x480 (TEST)',
    disabled: false,
    w: 640,
    h: 480,
  },
];

const audioDevices = [
  {
    id: 'test-video-1',
    name: 'name audio one',
  },
  {
    id: 'test-video-2',
    name: 'name audio two',
  },
];

describe('ParticipantDeviceSettings component with showModal in false value should', () => {
  beforeEach(() => {
    const onConfirm = cy.stub();
    const onCancel = cy.stub();

    mount(
      <ParticipantDeviceSettings
        onConfirm={onConfirm}
        onCancel={onCancel}
        currentDeviceConfiguration={currentDeviceConfiguration}
        videoDevices={videoDevices}
        audioInputDevices={audioDevices}
        renditions={renditions}
      />
    );
  });

  it('not be visible', () => {
    cy.get('.modal-dialog').should('not.exist');
  });
});

describe('ParticipantDeviceSettings component (with showModal set on true) should', () => {
  let onConfirm, onCancel, onDeviceSelected, onCapabilitiesSelected, onAudioDeviceSelected;

  beforeEach(() => {
    onConfirm = cy.stub();
    onCancel = cy.stub();
    onDeviceSelected = cy.stub();
    onCapabilitiesSelected = cy.stub();
    onAudioDeviceSelected = cy.stub();

    mount(
      <ParticipantDeviceSettings
        onConfirm={onConfirm}
        onCancel={onCancel}
        showModal={true}
        onVideoDeviceSelected={onDeviceSelected}
        onAudioDeviceSelected={onAudioDeviceSelected}
        onCapabilitiesSelected={onCapabilitiesSelected}
        currentDeviceConfiguration={currentDeviceConfiguration}
        videoDevices={videoDevices}
        audioInputDevices={audioDevices}
        renditions={renditions}
      />
    );
  });

  it('be correctly rendered', () => {
    cy.get('.modal-dialog').should('exist');
  });

  it('show the modal title', () => {
    cy.get('.modal-title').contains(Constants.DEVICE_SETTINGS.TITLE);
  });

  it('show the modal body with its corresponding content', () => {
    cy.get('.modal-body #red5pro-publisher').should('exist');
    cy.get('.modal-body').contains('Select Camera');
    cy.get('.modal-body').contains('Select Rendition');
    cy.get('.modal-body').contains('Select Microphone');
  });

  it('call the close button', () => {
    cy.get('#cancel')
      .click()
      .should(() => {
        expect(onCancel).to.be.called;
      });
  });

  it('show the accept button', () => {
    cy.get('#confirm').should('exist');
  });

  it('call onDeviceSelected when changing the device', () => {
    cy.get('#camera-selector')
      .trigger('change')
      .should(() => {
        expect(onDeviceSelected).to.be.called;
      });
  });

  it('call onAudioDeviceSelected when changing the mic', () => {
    cy.get('#mic-selector')
      .trigger('change')
      .should(() => {
        expect(onAudioDeviceSelected).to.be.called;
      });
  });

  it('call onCapabilitiesSelected when changing the rendition', () => {
    cy.get('#rendition-selector')
      .trigger('change')
      .should(() => {
        expect(onCapabilitiesSelected).to.be.called;
      });
  });
});
