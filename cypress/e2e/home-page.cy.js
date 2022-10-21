import { mainPage } from '../locators';
import utils from '../src/utils';

describe('Visuals', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});
	it('Verify the visuals of the profile page', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid
			utils.createAccountAndSignIn(data.body)
		})
		cy.get(mainPage.profileLogo).click();
		cy.wait('@workspace');
		cy.compareSnapshot('profile-page');
	});

	it('Verify clicking on "Add my first debt" button should take you to debt page', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.wait('@workspace')
		cy.get(mainPage.addMyFirstDebtButton).click();
		cy.url().should('include', 'debt');
	});

	it('Verify clicking on "Primary" button should take you to workspaces page', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.wait('@workspace')
		cy.get(mainPage.primaryButton).click();
		cy.url().should('include', 'settings/workspaces');
	});
});