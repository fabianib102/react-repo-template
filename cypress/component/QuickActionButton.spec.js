import React from 'react';
import QuickActionButton from '../../src/components/conference/quickActions/QuickActionButton';
import { mount } from '@cypress/react';

describe('QuickActionButton component should', () => {
  const testTitle = "testTitle";
  const testClass = "test-element";
  const testAddClass = "class-to-add";

  beforeEach(() => {
    mount(<QuickActionButton title={testTitle} icon={<div className={testClass} >ICON</div>} className={testAddClass} />);
  });

  it('Contains a button with quick-action-button class', () => {
    cy.get('Button').should('have.class', 'quick-action-button');
  });

  it('Contains an icon inside the button according the props.icon value', () => {
    cy.get(`Button .icon .${testClass}`).should('be.visible');
  });

  it('Show a popover with the expected text when clicking the button', () => {
    cy.get('Button').click();
    cy.contains(testTitle).should('be.visible');
  });

  it('Contains a button with the class(es) defined in the className property', () => {
    cy.get('Button').should('have.class', testAddClass);
  });
});