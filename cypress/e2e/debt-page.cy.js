import { debtPage, shared } from '../locators';
import utils from '../src/utils';
import { data } from '../src/data';

describe('debt page tests', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});

	it('Verify debt creation [Annual Percentage Rate] field, ID: 26', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// Annual Percentage Rate should only take numbers as an input
		cy.get(debtPage.annualPercentageRateInput).type(data.longTexg);
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

	it('Verify debt creation [minimum payment] field, ID: 27', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// minimum payment should only take numbers as an input
		cy.get(debtPage.minimumPaymentAmountInput).type(data.longTexg);
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.minimumPaymentAmountInput).should('have.attr', 'aria-describedby', 'mat-error-5');
		// entering number should be valid
		cy.get(debtPage.minimumPaymentAmountInput).type(data.validNumber);
		cy.get(debtPage.nicknameInput).click();
		cy.get(debtPage.minimumPaymentAmountInput).should('have.attr', 'aria-invalid', 'false');
		cy.get(debtPage.minimumPaymentTooltip).click();
		cy.get(debtPage.minimumPaymentTooltipText).should('have.text', data.tooltipText);
	});

	it('Verify debt creation [calender] field, ID: 28', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// clicking on a date in the past should show an error
		cy.get(debtPage.dueDataButton).click();
		cy.get(debtPage.previousMonthButton).click();
		cy.get(debtPage.calenderDaysButtons).first().click();
		cy.get(debtPage.oldDataMsg).should('have.text', data.oldDataMsg);
		// clicking on a date that is not shared across all months should show an error
		cy.get(debtPage.calenderDaysButtons).last().click();
		cy.get(debtPage.oldDataMsg).should('have.text', data.wrongDataMsg);
	});

	it('Verify debt page after creating a debt, ID: 29', () => {
		cy.intercept('api/v2/user/workspace/*').as('workspace');
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.fillDebtInfo('adewdbc', '2000', '300', '300');
		cy.compareSnapshot('debt-page-after-debt-added');
	});
});
