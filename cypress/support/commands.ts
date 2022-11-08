const compareSnapshotCommand = require('cypress-image-diff-js/dist/command')
compareSnapshotCommand()
import '@4tw/cypress-drag-drop'
require('@4tw/cypress-drag-drop')



Cypress.Commands.add('deleteUser', (uid: string) => {
    cy.request("DELETE", `http://54.39.177.218:3020/api/v2/test-accounts/uid/${uid}`).then(response => {
        expect(response.status).to.be.equal(200);
    })
});

Cypress.Commands.add('changeViewport', (view: string) => {
    if(view = 'DD'){
        cy.viewport(1387, 764)
    }else {
        cy.viewport(390, 844)
    }
});

Cypress.Commands.add('swipeElement', (element: string, index: number = 0) => {
    cy.get(element).eq(index).trigger('pointerdown', { which: 1 })
    .trigger('pointermove', 'left')
    .trigger('pointerup', { force: true })
});

