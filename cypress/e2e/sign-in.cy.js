import { data } from '../src/data';
import { loginPage, mainPage, shared } from '../locators';
import utils from '../src/utils';

describe('sign in page tests', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});

	it('signin and signout, ID: 1', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/')
			cy.log(response.body)
			cy.get(loginPage.usernameInput).type(response.body.username)
			cy.get(loginPage.passwordInput).type(response.body.password)
			cy.get(shared.submitButton).click()
			// The reason for the 10% threshold is that in this page each time im using a new email.
			cy.get(loginPage.codeInput).type(response.body.vcode)
			cy.get(shared.submitButton).click()
			cy.get("app-greeting h3").should('have.text', data.welcomeText);
			cy.get(mainPage.profileLogo).click()
			cy.contains('Sign out').click()
			cy.url().should('include', 'sign-in');
		})
	});

	it('Home page validation, ID: 2', () => {
		utils.newAccountCredentials().then((response) => {
			expect(response.status).to.be.equal(200);
			accountToBeDeletedUid = response.body.uid
			cy.visit('/')
			cy.log(response.body)
			cy.get(loginPage.usernameInput).type(response.body.username);
			cy.get(loginPage.passwordInput).type(response.body.password);
			cy.get(shared.submitButton).click();
			cy.get(loginPage.codeInput).should('be.visible')
			// The reason for the 10% threshold is that in this page each time im using a new email.
			cy.compareSnapshot('code-page', 0.1);
			cy.get(loginPage.codeInput).type(response.body.vcode);
			cy.get(shared.submitButton).click();
			cy.get("app-greeting h3").should('have.text', data.welcomeText);
			cy.compareSnapshot('home-page');
		})
	});
});

describe('Field validation, login page visuals', () => {
	beforeEach(() => {
		cy.visit('/')
	})
	it('Login Page, ID: 4', () => {
		cy.compareSnapshot('login-page');
	});


	it('Verify entering wrong email format shows an error, ID: 5', () => {
		cy.get(loginPage.usernameInput).type(data.invalidEmail);
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.validationMessage).should('have.text', data.invalidEmailMsg);
	});

	it('Verify empty email and password shows an error, ID: 6', () => {
		cy.get(loginPage.usernameInput).click();
		cy.get(loginPage.passwordInput).click();
		cy.get(loginPage.usernameInput).click();
		cy.get(shared.validationMessage).eq(0).should('have.text', data.requiredFieldMsg);
		cy.get(shared.validationMessage).eq(1).should('have.text', data.requiredFieldMsg);
	});

	it('Verify empty password shows an error, ID: 7', () => {
		cy.get(loginPage.usernameInput).type(data.validEmail);
		cy.get(loginPage.passwordInput).click();
		cy.get(loginPage.usernameInput).click();
		cy.get(shared.validationMessage).should('have.text', data.requiredFieldMsg);
	});

	it('Verify clicking on the eye icon should show the password, ID: 8', () => {
		cy.get(loginPage.passwordInput).type('I AM SEEN!');
		cy.get(loginPage.passwordInput).should('have.attr', 'type', 'password');
		cy.get(loginPage.showPasswordIcon).click();
		cy.get(loginPage.passwordInput).should('have.attr', 'type', 'text');
	});

	it('Verify sign-in button is only enabled when email is valid and password is filled, ID: 9', () => {
		// with invalid email format and empty password
		cy.get(loginPage.usernameInput).type(data.invalidEmail);
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format and empty password
		cy.get(loginPage.usernameInput).clear().type(data.validEmail);
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format and filled password
		cy.get(loginPage.passwordInput).type('Password123');
		cy.get(shared.submitButton).should('be.enabled');
	});

	it('Verify clicking sign-up link should take you to sign-up page, ID: 10', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.compareSnapshot('sign-up-page');
	});
});
