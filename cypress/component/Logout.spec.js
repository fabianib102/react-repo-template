import React from 'react';
import { mount } from '@cypress/react';
import Logout from '../../src/components/Logout';
import { LoaderContext } from '../../src/context/LoaderContext';
import { BrowserRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';

describe('Logout component, using context, should', () => {
  let setLoadingStub;
  const SutWithContext = (values) => {
    return (
      <BrowserRouter>
        <LoaderContext.Provider value={values}>
          <Logout />
        </LoaderContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    setLoadingStub = cy.stub();
    const props = { show: false, setIsLoading: setLoadingStub };
    mount(<SutWithContext {...props} />);
    cy.stub(Auth, 'signOut');
  });

  it('Contains a button with text', () => {
    cy.get('Button').should('have.length', '1');
    cy.get('Button').contains('Logout');
  });

  it('Contains an icon', () => {
    cy.get('.logout-icon');
  });

  it('Call setIsLoading method', () => {
    cy.get('Button')
      .click({ force: true })
      .then(() => {
        expect(setLoadingStub).to.be.called;
      });
  });

  it('Call signOut method', () => {
    cy.get('Button')
      .click({ force: true })
      .then(() => {
        expect(Auth.signOut).to.be.called;
      });
  });
});
