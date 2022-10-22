import { debtPage, shared } from '../locators';
import utils from '../src/utils';
import { data } from '../src/data';

describe('debt page tests', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});
	it('Verify the visuals of the debt page, ID: 21', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace')
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.get(debtPage.navbarDebtButton).click();
		cy.wait('@workspace');
		cy.get(debtPage.addDebtButton).eq(1).click({ force: true });
	});

	it('Verify debt creation validation field, ID: 22', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.currentBalanceInput).click();
		cy.get(shared.validationMessage).should('have.length', 1)
		cy.get(debtPage.annualPercentageRateInput).click();
		cy.get(shared.validationMessage).should('have.length', 2)
		cy.get(debtPage.minimumPaymentAmountInput).click();
		cy.get(shared.validationMessage).should('have.length', 3)
		cy.get(debtPage.nicknameInput).click();
		cy.get(shared.validationMessage).should('have.length', 4)
	});

	it('Verify debt creation submit button should be enabled only when all the required fields are filled, ID: 23', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(debtPage.nicknameInput).type(data.validText);
		cy.get(shared.submitButton).should('be.disabled');
		cy.get(debtPage.currentBalanceInput).type(data.validNumber);
		cy.get(shared.submitButton).should('be.disabled');
		cy.get(debtPage.annualPercentageRateInput).type('200');
		cy.get(shared.submitButton).should('be.disabled');
		cy.get(debtPage.minimumPaymentAmountInput).type('200');
		cy.get(shared.submitButton).should('be.enabled');
	});

	it('Verify debt creation [nickname] field, ID: 24', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(debtPage.nicknameInput).type(data.longTexg);
		cy.get(debtPage.nicknameInput).should('have.attr', 'aria-invalid', 'false');
	});

	it('Verify debt creation [Current balance] field, ID: 25', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// current balance should only take numbers as an input
		cy.get(debtPage.currentBalanceInput).type(data.longTexg);
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.currentBalanceInput).should('have.attr', 'aria-describedby', 'mat-error-3');
		// entering number should be valid
		cy.get(debtPage.currentBalanceInput).type(data.validNumber);
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.currentBalanceInput).should('have.attr', 'aria-invalid', 'false');
	});
});
