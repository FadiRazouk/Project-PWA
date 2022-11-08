import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';
import { data } from '../src/Data';
const isMobile = Cypress.env('isMobile');
const date = new Date('August 23, 2022 13:12:59').getTime();


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

	it('Verify debt page after creating a debt, ID: 29', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.wait(5000)
		cy.compareSnapshot(isMobile ? 'debt-page-after-debt-added' : 'debt-page-after-debt-added(D)', 0);
	});

	it('Verify debt page Summary slider, ID: 42', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		// The dots on the slider are not working, this will be skipped.
		isMobile && cy.swipeElement('[class="chartjs-render-monitor"]', 1)
		cy.contains('Balance by debt').should('be.visible');
		cy.compareSnapshot(isMobile ? 'Summary': 'Summary(D)', 0);
	});

	it('Verify debt page debts sorting [A-Z], ID: 43', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		cy.get(selectors.debtPage.debtName).eq(0).should('have.text', 'HELOC');
		cy.get(selectors.debtPage.sortButton).click();
		cy.wait(1000)
		cy.get(selectors.debtPage.debtName).eq(0).should('have.text', 'Visa');
	});

	it('Verify debt page debts sorting [Balance], ID: 44', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		cy.get(selectors.debtPage.debtName).eq(0).should('have.text', 'HELOC');
		cy.get('.mat-form-field-infix').click();
		cy.get('#mat-option-2').click();
		cy.wait(500);
		cy.get(selectors.debtPage.debtName).eq(0).should('have.text', 'TV');
	});

	it('Verify debt page debts sorting [APR], ID: 46', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		cy.get(selectors.debtPage.debtName).last().should('have.text', 'Visa');
		cy.get('.mat-form-field-infix').click();
		cy.get('#mat-option-0').click();
		cy.wait(500);
		cy.get(selectors.debtPage.debtName).last().should('have.text', 'Discover');
	});

	it('Verify debt page debts sorting [Name], ID: 47', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		cy.get(selectors.debtPage.debtName).eq(0).should('have.text', 'HELOC');
		cy.get('.mat-form-field-infix').click();
		cy.get('#mat-option-6').click();
		cy.wait(500);
		cy.get(selectors.debtPage.debtName).eq(0).should('have.text', 'Discover');
	});

	it('Verify debt page debt search, ID: 45', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		cy.get('.search-bar').type('Visa');
		cy.get('.search-results').click();
		cy.url().should('include', 'debt/6/progress')
	});

	xit('Verify debt page debts sorting [Custom], ID: 46', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();

		cy.get(selectors.debtPage.debtName).eq(0).should('have.text', 'HELOC');
		cy.get('.mat-form-field-infix').click();
		cy.get('#mat-option-3').click();
		cy.wait(500);
		cy.get('.paragraph-p3-heavy').click();
		cy.pause()
		cy.get('[class*="drag-handle"]').eq(0).drag(':nth-child(7) > .mat-ripple > .header > .cdk-drag-handle', {force:true});
	});

	it('Verify debt page clicking on a debt should take you to debt page, ID: 48', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		cy.get(selectors.debtPage.debtName).eq(0).click();
		cy.url().should('include', 'debt/0/progress')
	});

	it.only('Verify debt page clicking on the pencil icon on the debt card will navigate to the debt details page, ID: 49', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts();
		cy.reload();
		cy.get(selectors.debtPage.navbarDebtButton).click();
		cy.wait(1500);
		cy.get('[class*="fa-pen"]').eq(0).click();
		cy.url().should('include', isMobile? 'debt/0/details' : '/0/progress?details=1');
	});
});
