import './commands';

beforeEach(() => {
  cy.window().then((window) => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });
  cy.intercept('api/v2/user/workspace/*').as('workspace')
  cy.intercept('api/v2/user/data').as('user-data')
  cy.intercept('https://www.debtpayoffplanner.com//wp-json/wp/v2/*').as('planner');

  // const date = new Date('October 22, 2022').getTime();
  // cy.clock(date)
  cy.changeViewport('dd')
});

after(() => {
  cy.task('generateReport')
})
Cypress.on('uncaught:exception', () => false);
