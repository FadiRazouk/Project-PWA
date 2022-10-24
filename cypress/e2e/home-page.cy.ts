import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';

describe('home page tests', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});
	it('Verify the visuals of the profile page, ID: 17', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid
			utils.createAccountAndSignIn(data.body)
		})
		cy.get(selectors.mainPage.profileLogo).click();
		cy.wait('@workspace');
		cy.compareSnapshot('profile-page', 0);
	});

	it('Verify clicking on "Add my first debt" button should take you to debt page, ID: 18', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.wait('@workspace')
		cy.contains('Add my first debt').click();
		cy.url().should('include', 'debt');
	});

	it('Verify clicking on "Primary" button should take you to workspaces page, ID: 19', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.wait('@workspace')
		cy.get(selectors.mainPage.primaryButton).click();
		cy.url().should('include', 'settings/workspaces');
	});

	it.only('Verify home page after creating a debt, ID: 20', () => {
		const date = new Date('October 20, 2022').getTime();
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.fillDebtInfo('adewdbc', '2000', '300', '300');
		cy.get(selectors.mainPage.navbarHomeButton).click();
		cy.wait('@planner');
		// wait for home page to load
		cy.wait(5000);
		// 10% is for the date as it wont be a the same each time
		cy.compareSnapshot('home-page-after-debt-added', 0.1);
	});
});
