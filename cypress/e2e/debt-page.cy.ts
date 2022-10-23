import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';
import { data } from '../src/Data';

describe('debt page tests', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});

	it('Verify debt creation [Annual Percentage Rate] field, ID: 26', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// Annual Percentage Rate should only take numbers as an input
		cy.get(selectors.debtPage.annualPercentageRateInput).type(data.data.longTexg);
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.annualPercentageRateInput).should('have.attr', 'aria-describedby', 'mat-error-4');
		cy.get(selectors.debtPage.annualPercentageRateInput).should('have.attr', 'max', '300');
		// entering number above 300 should show an error
		cy.get(selectors.debtPage.annualPercentageRateInput).type('400');
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.annualPercentageRateInput).should('have.attr', 'aria-describedby', 'mat-error-4');
		cy.contains('This value should be less than 300').should('be.visible');
		// entering number under or eq to 300 should be valid
		cy.get(selectors.debtPage.annualPercentageRateInput).clear().type('300');
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.annualPercentageRateInput).should('not.have.attr', 'aria-describedby', 'mat-error-4');
	});

	it('Verify debt creation [minimum payment] field, ID: 27', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// minimum payment should only take numbers as an input
		cy.get(selectors.debtPage.minimumPaymentAmountInput).type(data.data.longTexg);
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.minimumPaymentAmountInput).should('have.attr', 'aria-describedby', 'mat-error-5');
		// entering number should be valid
		cy.get(selectors.debtPage.minimumPaymentAmountInput).type(data.data.validNumber);
		cy.get(selectors.debtPage.nicknameInput).click();
		cy.get(selectors.debtPage.minimumPaymentAmountInput).should('have.attr', 'aria-invalid', 'false');
		cy.get(selectors.debtPage.minimumPaymentTooltip).click();
		cy.get(selectors.debtPage.minimumPaymentTooltipText).should('have.text', data.data.tooltipText);
	});

	it('Verify debt creation [calender] field, ID: 28', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebt();
		// clicking on a date in the past should show an error
		cy.get(selectors.debtPage.dueDataButton).click();
		cy.get(selectors.debtPage.previousMonthButton).click();
		cy.get(selectors.debtPage.calenderDaysButtons).first().click();
		cy.get(selectors.debtPage.oldDataMsg).should('have.text', data.data.oldDataMsg);
		// clicking on a date that is not shared across all months should show an error
		cy.get(selectors.debtPage.calenderDaysButtons).last().click();
		cy.get(selectors.debtPage.oldDataMsg).should('have.text', data.data.wrongDataMsg);
	});

	it.only('Verify debt page after creating a debt, ID: 29', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.fillDebtInfo('adewdbc', '2000', '300', '300');
		cy.get('.info.footer-light').should('be.visible');
		cy.wait(5000)
		cy.compareSnapshot('debt-page-after-debt-added', 0);
	});
});
