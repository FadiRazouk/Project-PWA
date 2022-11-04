/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    deleteUser(value: string): Chainable<Element>;
    changeViewport(value: string): Chainable<Element>;
    compareSnapshot(value: string, threshold: number): Chainable<Element>;
  }
}