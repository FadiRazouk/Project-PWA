import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';
const isMobile = Cypress.env('isMobile');


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
		cy.get(isMobile ? selectors.mainPage.profileLogo : '.picture').click();
		cy.wait('@workspace');
		cy.compareSnapshot(isMobile ? 'profile-page' : 'profile-page(D)', 0);
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
		cy.get(isMobile ? selectors.mainPage.primaryButton : '[class*="workspace-1"]').click();
		cy.url().should('include', 'settings/workspaces');
	});

	it('Verify home page after creating a debt, ID: 20', () => {
		const date = new Date('October 20, 2023').getTime();
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.fillDebtInfo('adewdbc', '2000', '300', '300');
		if (isMobile) {
			cy.get(selectors.mainPage.navbarHomeButton).click();
		} else { cy.contains('Home').click() }
		cy.wait('@planner');
		// wait for home page to load
		cy.wait(5000);
		cy.compareSnapshot(isMobile ? 'home-page-after-debt-added' : 'home-page-after-debt-added(D)', 0);
	});
});
