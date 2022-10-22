import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';
import { data } from '../src/Data';

describe('debt page tests', () => {
	let accountToBeDeletedUid: any
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});
	it('Verify the visuals of the debt page, ID: 21', () => {
		cy.visit('/');
		cy.intercept('api/v2/user/workspace/*').as('workspace')
		utils.newAccountCredentials().then((data: any) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait('@workspace');
		cy.get(selectors.debtPage.addDebtButton).eq(1).click({ force: true });
	});

	it('Verify debt creation validation field, ID: 22', () => {
		utils.newAccountCredentials().then((data: any) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.currentBalanceInput).click();
		cy.get(selectors.shared.validationMessage).should('have.length', 1)
		cy.get(selectors.debtPage.annualPercentageRateInput).click();
		cy.get(selectors.shared.validationMessage).should('have.length', 2)
		cy.get(selectors.debtPage.minimumPaymentAmountInput).click();
		cy.get(selectors.shared.validationMessage).should('have.length', 3)
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.shared.validationMessage).should('have.length', 4)
	});

	it('Verify debt creation submit button should be enabled only when all the required fields are filled, ID: 23', () => {
		utils.newAccountCredentials().then((data: any) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(selectors.debtPage.nicknameInput).type(data.data.validText);
		cy.get(selectors.shared.submitButton).should('be.disabled');
		cy.get(selectors.debtPage.currentBalanceInput).type(data.data.validNumber);
		cy.get(selectors.shared.submitButton).should('be.disabled');
		cy.get(selectors.debtPage.annualPercentageRateInput).type('200');
		cy.get(selectors.shared.submitButton).should('be.disabled');
		cy.get(selectors.debtPage.minimumPaymentAmountInput).type('200');
		cy.get(selectors.shared.submitButton).should('be.enabled');
	});

	it('Verify debt creation [nickname] field, ID: 24', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data: any) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		cy.get(selectors.debtPage.nicknameInput).type(data.data.longTexg);
		cy.get(selectors.debtPage.nicknameInput).should('have.attr', 'aria-invalid', 'false');
	});

	it('Verify debt creation [Current balance] field, ID: 25', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data: any) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// current balance should only take numbers as an input
		cy.get(selectors.debtPage.currentBalanceInput).type(data.data.longTexg);
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.currentBalanceInput).should('have.attr', 'aria-describedby', 'mat-error-3');
		// entering number should be valid
		cy.get(selectors.debtPage.currentBalanceInput).type(data.data.validNumber);
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.currentBalanceInput).should('have.attr', 'aria-invalid', 'false');
	});
});
