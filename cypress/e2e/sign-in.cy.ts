import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';
import { data } from '../src/Data';

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
			cy.get(selectors.loginPage.usernameInput).type(response.body.username)
			cy.get(selectors.loginPage.passwordInput).type(response.body.password)
			cy.get(selectors.shared.submitButton).click()
			// The reason for the 10% threshold is that in this page each time im using a new email.
			cy.get(selectors.loginPage.codeInput).type(response.body.vcode)
			cy.get(selectors.shared.submitButton).click()
			cy.get("app-greeting h3").should('have.text', data.data.welcomeText);
			cy.get(selectors.mainPage.profileLogo).click()
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
			cy.get(selectors.loginPage.usernameInput).type(response.body.username);
			cy.get(selectors.loginPage.passwordInput).type(response.body.password);
			cy.get(selectors.shared.submitButton).click();
			cy.get(selectors.loginPage.codeInput).should('be.visible')
			// The reason for the 10% threshold is that in this page each time im using a new email.
			cy.compareSnapshot('code-page', 0.1);
			cy.get(selectors.loginPage.codeInput).type(response.body.vcode);
			cy.get(selectors.shared.submitButton).click();
			cy.get("app-greeting h3").should('have.text', data.data.welcomeText);
			cy.wait(5000)
			cy.compareSnapshot('home-page', 0);
		})
	});
});

describe('Field validation, login page visuals', () => {
	beforeEach(() => {
		cy.visit('/')
	})
	it('Login Page, ID: 4', () => {
		cy.compareSnapshot('login-page', 0);
	});


	it('Verify entering wrong email format shows an error, ID: 5', () => {
		cy.get(selectors.loginPage.usernameInput).type(data.data.invalidEmail);
		cy.get(selectors.loginPage.passwordInput).click();
		cy.get(selectors.shared.validationMessage).should('have.text', data.data.invalidEmailMsg);
	});

	it('Verify empty email and password shows an error, ID: 6', () => {
		cy.get(selectors.loginPage.usernameInput).click();
		cy.get(selectors.loginPage.passwordInput).click();
		cy.get(selectors.loginPage.usernameInput).click();
		cy.get(selectors.shared.validationMessage).eq(0).should('have.text', data.data.requiredFieldMsg);
		cy.get(selectors.shared.validationMessage).eq(1).should('have.text', data.data.requiredFieldMsg);
	});

	it('Verify empty password shows an error, ID: 7', () => {
		cy.get(selectors.loginPage.usernameInput).type(data.data.validEmail);
		cy.get(selectors.loginPage.passwordInput).click();
		cy.get(selectors.loginPage.usernameInput).click();
		cy.get(selectors.shared.validationMessage).should('have.text', data.data.requiredFieldMsg);
	});

	it('Verify clicking on the eye icon should show the password, ID: 8', () => {
		cy.get(selectors.loginPage.passwordInput).type('I AM SEEN!');
		cy.get(selectors.loginPage.passwordInput).should('have.attr', 'type', 'password');
		cy.get(selectors.loginPage.showPasswordIcon).click();
		cy.get(selectors.loginPage.passwordInput).should('have.attr', 'type', 'text');
	});

	it('Verify sign-in button is only enabled when email is valid and password is filled, ID: 9', () => {
		// with invalid email format and empty password
		cy.get(selectors.loginPage.usernameInput).type(data.data.invalidEmail);
		cy.get(selectors.loginPage.passwordInput).click();
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// with valid email format and empty password
		cy.get(selectors.loginPage.usernameInput).clear().type(data.data.validEmail);
		cy.get(selectors.loginPage.passwordInput).click();
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// with valid email format and filled password
		cy.get(selectors.loginPage.passwordInput).type('Password123');
		cy.get(selectors.shared.submitButton).should('be.enabled');
	});

	it('Verify clicking sign-up link should take you to sign-up page, ID: 10', () => {
		cy.get(selectors.loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.compareSnapshot('sign-up-page', 0);
	});
});
