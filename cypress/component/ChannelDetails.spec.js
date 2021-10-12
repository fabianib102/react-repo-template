import React from 'react';
import { mount } from '@cypress/react';
import ChannelDetails from '../../src/components/ChannelDetails';
import { BrowserRouter } from 'react-router-dom';
import Red5ProContext from '../../src/context/Red5ProServiceContext';
import AuthContext from '../../src/context/Auth';

describe('ChannelDetails component should', () => {
  const Sut = () => {
    return (
      <BrowserRouter>
        <AuthContext.Provider>
          <Red5ProContext.Provider>
            <ChannelDetails />
          </Red5ProContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mount(<Sut />);
  });

  it('Be rendered correctly', () => {
    cy.get('nav').should('have.length', '1');
    cy.get('a#tabs-channel-details-tab-WebRTC').contains('WebRTC');
    cy.get('a#tabs-channel-details-tab-RTMP').contains('RTMP');
    cy.get('input[type="checkbox"]#checkABR');
    cy.get('label[for="checkABR"]').contains('Use ABR');
    cy.contains('Broadcaster preview');
    cy.get('Button').should('have.length', '2');
  });

  it('Render certain elements with the WebRTC option active.', () => {
    cy.get('#tabs-channel-details-tab-WebRTC').click();
    cy.contains('Broadcaster preview');
    cy.contains('Select Device');
    cy.contains('Select Rendition');
    cy.contains('Embed your stream on other websites');
    cy.get('Select').should('have.length', '2');
  });

  it('Have disabled the RTMP option', () => {
    cy.get('#tabs-channel-details-tab-RTMP').should('have.class', 'disabled');
  });
});
