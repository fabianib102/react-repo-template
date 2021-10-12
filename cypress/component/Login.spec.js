import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from '@cypress/react';
import { LoaderContext } from '../../src/context/LoaderContext';
import AuthContext from '../../src/context/Auth';
import Login from '../../src/components/Login';
import wrappers from '../../src/assets/utils/Window';

const showNotificationStub = () => {};

describe('Login component should', () => {
  let setLoadingStub, setAuthDataStub;

  const Sut = (values) => {
    return (
      <BrowserRouter>
        <AuthContext.Provider>
          <LoaderContext.Provider value={values}>
            <Login shownotification={showNotificationStub} />
          </LoaderContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    setLoadingStub = cy.stub().as('setLoader');
    setAuthDataStub = cy.stub().as('setAuthData');
    cy.stub(wrappers, 'navigate').as('navigateWrapper');
    cy.stub(AuthContext, 'useAuth').returns({ authData: { progress: 'mockStep' }, setAuthData: setAuthDataStub });
    const props = { show: false, setIsLoading: setLoadingStub };
    mount(<Sut {...props} />);
  });

  it('Contains a button with text', () => {
    cy.get('Button').should('have.length', '1');
    cy.get('Button').contains('SIGN IN WITH AZURE');
  });

  it('Navigate to new url on sign in', () => {
    cy.get('Button').click();
    cy.get('@navigateWrapper').should('have.been.called');
  });

  it('Invoke setLoading function on sign in', () => {
    cy.get('Button').click();
    cy.get('@setLoader').should('have.been.called');
  });

  it('Invoke setAuthData function on sign in', () => {
    cy.get('Button').click();
    cy.get('@setAuthData').should('have.been.called');
  });

  it('Invoke setAuthData with default parameters (clear) when the user is not authenticated', () => {
    const defaultAuthData = { type: AuthContext.ActionKind.LoggedOut, payload: AuthContext.defaultAuthData };
    cy.get('Button').click();
    cy.get('@setAuthData').should('have.been.calledWith', defaultAuthData);
  });
});
