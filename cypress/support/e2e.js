import './commands';

beforeEach(() => {
  cy.window().then((window) => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });
  cy.intercept('api/v2/user/workspace/*').as('workspace')
  cy.intercept('api/v2/user/data').as('user-data')
  
});



after(() => {
  cy.task('generateReport')
})
Cypress.on('uncaught:exception', () => false);