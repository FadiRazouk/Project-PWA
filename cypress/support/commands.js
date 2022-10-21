const compareSnapshotCommand = require('cypress-image-diff-js/dist/command')
compareSnapshotCommand()

Cypress.Commands.add('deleteUser', (uid) => {
    cy.request("DELETE", `http://54.39.177.218:3020/api/v2/test-accounts/uid/${uid}`).then(response => {
        expect(response.status).to.be.equal(200);
    })
});
