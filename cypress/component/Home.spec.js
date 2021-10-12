import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../src/assets/css/Styles.scss';
import { mount } from '@cypress/react';
import Home from '../../src/components/Home';
import { LoaderContext } from '../../src/context/LoaderContext';
import { BrowserRouter } from 'react-router-dom';
import Constants from '../../src/assets/utils/Constants';
import AuthContext from '../../src/context/Auth';
import Red5ProContext from '../../src/context/Red5ProServiceContext';

describe('Home component should', () => {
  const showNotificationStub = () => {};

  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/channels`, []);
  });

  const Sut = () => {
    return (
      <BrowserRouter>
        <AuthContext.Provider>
          <Red5ProContext.Provider>
            <Home shownotification={showNotificationStub} />
          </Red5ProContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('Contains a button with text', () => {
    mount(<Sut />);
    cy.get('Button').contains(`CREATE ${Constants.CHANNEL_LABEL.toUpperCase()}`);
  });

  it('Contains a default text', () => {
    mount(<Sut />);
    cy.contains('There are no records to display');
  });

  it('Contains a link to access the Infrastructure', () => {
    mount(<Sut />);
    cy.get('a').contains('Infrastructure');
  });
});

describe('Home component, using context, should', () => {
  let setLoadingStub;
  const showNotificationStub = () => {};

  const SutWithContext = (values) => {
    return (
      <LoaderContext.Provider value={values}>
        <BrowserRouter>
          <AuthContext.Provider>
            <Red5ProContext.Provider>
              <Home shownotification={showNotificationStub} />
            </Red5ProContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      </LoaderContext.Provider>
    );
  };

  beforeEach(() => {
    setLoadingStub = cy.stub();
    const props = { show: false, setIsLoading: setLoadingStub };
    mount(<SutWithContext {...props} />);
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/channels`, []);
  });

  it('Invoke setLoading function on getting channels', () => {
    cy.get('@SutWithContext').should(() => {
      expect(setLoadingStub).to.be.called;
    });
  });
});
