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
		cy.compareSnapshot(isMobile ? 'profile-page' : 'profile-page(D)', 0.1);
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
		cy.compareSnapshot(isMobile ? 'home-page-after-debt-added' : 'home-page-after-debt-added(D)', 0.1);
	});

	it('Verify clicking on "profile" button should take you to profile page, ID: 37', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.wait('@workspace');
		cy.get('.fa-user-circle').eq(isMobile? 0:1).click();
		cy.url().should('include', 'top/settings');
	});

	if(isMobile){
		// This does not seem to be visible in the DD view.
		it('Verify clicking on "view categories" dropdown should show all the categories, ID: 38', () => {
			const date = new Date('August 23, 2022 13:12:59').getTime();
			utils.newAccountCredentials().then((data) => {
				accountToBeDeletedUid = data.body.uid;
				utils.createAccountAndSignIn(data.body);
			});
			cy.clock(date);
			utils.addDebts()
			cy.reload();
			//Show
			cy.get(selectors.mainPage.showCatagories).click();
			cy.get(selectors.mainPage.catagories).should('have.length', 5)
			//Hide
			cy.get(selectors.mainPage.showCatagories).click();
			cy.get(selectors.mainPage.catagories).should('have.length', 0)
		});
	}


	it('Verify clicking on "learn more" button should show Upgrade to Pro, ID: 39', () => {
		const date = new Date('August 23, 2022 13:12:59').getTime();
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts()
		cy.reload();
		cy.get('.card > .mat-focus-indicator').click();
		cy.wait(5000);
		cy.compareSnapshot(isMobile ? 'upgrade-to-pro' : 'upgrade-to-pro(D)', 0);
	});

	it('Verify clicking on "closing adv" button should show Upgrade to Pro, ID: 40', () => {
		const date = new Date('August 23, 2022 13:12:59').getTime();
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts()
		cy.reload();
		cy.wait(5000)
		cy.get('[class*="mat-icon-b"]').eq(isMobile? 0:2).click()
		cy.compareSnapshot(isMobile ? 'upgrade-to-pro' : 'upgrade-to-pro-adv-close(D)', 0);
	});

	it('Verify clicking on "closing tips" button should show reminder, ID: 40', () => {
		cy.changeViewport('dd')
		const date = new Date('August 23, 2022 13:12:59').getTime();
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		cy.clock(date);
		utils.addDebts()
		cy.reload();
		for(let i=0; i<=4;i++){
			cy.get(selectors.mainPage.didYouKnowPagination).eq(i).click({force:true});
			cy.get('.swiper-slide-visible > .mat-focus-indicator').click({force:true});
		}	
		cy.get('[class*="mat-icon-b"]').eq(1).click({force:true})
		cy.contains('You can always re-enable the ‘Did you know’ section in User Settings.').should('be.visible')
	});

	it('Verify clicking on "closing tips" button should show reminder, ID: 41', () => {
		utils.newAccountCredentials().then((data) => {
			accountToBeDeletedUid = data.body.uid;
			utils.createAccountAndSignIn(data.body);
		});
		utils.addDebts()
		cy.reload();
		cy.get('.card-header > .footer-light').click();
		cy.url().should('include', 'public/articles');
		cy.get('a.mat-focus-indicator > :nth-child(1) > .mat-focus-indicator').click()
		cy.url().should('include', 'main/focus');
	});
});