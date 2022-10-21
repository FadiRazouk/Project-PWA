import { debtPage, shared } from '../locators';
import utils from '../src/utils';

describe('Visuals', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});
	it('Verify the visuals of the debt page', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace')
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.get(debtPage.navbarDebtButton).click();
		cy.wait('@workspace');
		cy.get(debtPage.addDebtButton).eq(1).click({ force: true });
	});

	it('Verify debt creation validation field', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
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

	it('Verify debt creation submit button should be enabled only when all the required fields are filled', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(debtPage.nicknameInput).type('ValidInput');
		cy.get(shared.submitButton).should('be.disabled');
		cy.get(debtPage.currentBalanceInput).type('1234');
		cy.get(shared.submitButton).should('be.disabled');
		cy.get(debtPage.annualPercentageRateInput).type('200');
		cy.get(shared.submitButton).should('be.disabled');
		cy.get(debtPage.minimumPaymentAmountInput).type('200');
		cy.get(shared.submitButton).should('be.enabled');
	});

	it('Verify debt creation [nickname] field', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(debtPage.nicknameInput).type('someNameKindaLongButNotTooLong');
		cy.get(debtPage.nicknameInput).should('have.attr', 'aria-invalid', 'false');
	});

	it('Verify debt creation [Current balance] field', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// current balance should only take numbers as an input
		cy.get(debtPage.currentBalanceInput).type('someNameKindaLongButNotTooLong');
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.currentBalanceInput).should('have.attr', 'aria-describedby', 'mat-error-3');
		// entering number should be valid
		cy.get(debtPage.currentBalanceInput).type('1234');
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.currentBalanceInput).should('have.attr', 'aria-invalid', 'false');
	});

	it('Verify debt creation [Annual Percentage Rate] field', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// Annual Percentage Rate should only take numbers as an input
		cy.get(debtPage.annualPercentageRateInput).type('someNameKindaLongButNotTooLong');
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.annualPercentageRateInput).should('have.attr', 'aria-describedby', 'mat-error-4');
		cy.get(debtPage.annualPercentageRateInput).should('have.attr', 'max', '300');
		// entering number above 300 should show an error
		cy.get(debtPage.annualPercentageRateInput).type('400');
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.annualPercentageRateInput).should('have.attr', 'aria-describedby', 'mat-error-4');
		cy.contains('This value should be less than 300').should('be.visible');
		// entering number under or eq to 300 should be valid
		cy.get(debtPage.annualPercentageRateInput).clear().type('300');
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.annualPercentageRateInput).should('not.have.attr', 'aria-describedby', 'mat-error-4');
	});
});
