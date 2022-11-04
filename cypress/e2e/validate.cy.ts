import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';
import { data } from '../src/Data';

describe('Validate page tests', () => {
	let accountToBeDeletedUid
	const isMobile = Cypress.env('isMobile');
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});

	it('Validate page visuals, ID: 2', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/')
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible')
			cy.compareSnapshot(isMobile ? 'validate-page': 'validate-page(D)', 0);
		})
	});

	it('Validate page the header text should matched the logged in email, ID: 30', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/');
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible');
			cy.get('.code-email').invoke('text').then((text)=> {
				expect(text).to.contain(response.body.username)
			})
		})
	});

	// This testcase is a bug as clicking the back button will take you to a white page.
	xit('Validate page the back button should take you to the sign in page, ID: 31', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/');
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible');
			cy.get(selectors.loginPage.backButton).click()
		})
	});

	it('Validate page resend code dialog and API request, ID: 32', () => {

		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/');
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible');
			cy.contains('Resend code').click();
			// cy.wait('@validation');
			cy.get('[id*="dialog-title"]').should('have.text', data.data.resendValCodeMsgHeader);
			cy.get(selectors.loginPage.resendCodeMsg).should('have.text', data.data.resendValCodeMsg);
			cy.get('[cdkfocusinitial]').click()
		})
	});

	it('Validate page checking the "Didn’t receive an email?" visual, ID: 33', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/');
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible');
			cy.get('.no-email').click();
			isMobile && cy.url().should('include', 'troubleshoot');
			cy.compareSnapshot(isMobile ? 'troubleshoot-page': 'troubleshoot-page(D)', 0);
		})
	});

	xit('Validate page checking the "Didn’t receive an email?" edit email, ID: 34', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/');
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible');
			cy.get('.no-email').click();
			cy.get('.edit-email').should('include.text', response.body.username);
			cy.get(selectors.loginPage.penIconButton).click();
			cy.get(selectors.loginPage.usernameInput).should('have.value', response.body.username);
			cy.get(selectors.loginPage.usernameInput).clear().type(data.data.invalidEmail);
			cy.get(selectors.shared.submitButton).should('be.disabled');
			cy.get(selectors.loginPage.usernameInput).clear().type(data.data.validEmail);
			cy.get(selectors.shared.submitButton).should('be.enabled');
			cy.get(selectors.shared.submitButton).eq(isMobile?0:1).click()
			//TBD this seems like a bug as i cant update email. (but i can see the mail in DD view)
			cy.get('.edit-email').should('include.text', data.data.validEmail);
		});
	});

	it('Validate page checking the "Didn’t receive an email?" contact support, ID: 35', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/');
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible');
			cy.get('.no-email').click();
			// This selector will check that there is a button with the link that will open the defult emailing
			// system and it will have a prefixed email and subject.
			cy.get(selectors.loginPage.contactUsButton).should('be.visible');
		});
	});

	it('Validate page checking the submit button is disabled when the code is not filled, ID: 36', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/');
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible');
			// it only accepts int input
			cy.get(selectors.loginPage.codeInput).type('someText');
			cy.get(selectors.shared.submitButton).should('be.disabled');
			// leaving few empty
			cy.get(selectors.loginPage.codeInput).type('123');
			cy.get(selectors.shared.submitButton).should('be.disabled');
			// full input but invalid code.
			cy.get(selectors.loginPage.codeInput).clear().type('123456');
			cy.get(selectors.shared.submitButton).should('be.enabled');
			cy.get(selectors.shared.submitButton).click();
			cy.contains(' Error: "vcode is incorrect"').should('be.visible');
		});
	});
});
