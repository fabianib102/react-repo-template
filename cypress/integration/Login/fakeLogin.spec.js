describe('Check if a user can login correctly', () => {
  it('Login a user using local storage', () => {
    cy.mountCredentials();
    cy.get('#logoutButton').should('be.visible');
  });
});
