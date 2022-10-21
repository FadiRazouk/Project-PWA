import { loginPage, mainPage, shared } from '../locators';
import utils from '../src/utils';

describe('Visuals', () => {
	let accountToBeDeletedUid
	afterEach(() => {
		cy.deleteUser(accountToBeDeletedUid)
	});

	it('signin and signout', () => {
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
			cy.get("app-greeting h3").should('have.text', 'Hi QA Test! Primary');
			cy.get(mainPage.profileLogo).click()
			cy.contains('Sign out').click()
			cy.url().should('include', 'sign-in');
		})
	})
	it('Home page validation', () => {
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
			cy.get("app-greeting h3").should('have.text', 'Hi QA Test! Primary');
			cy.compareSnapshot('home-page');
		})
	})
})

describe('Field validation, login page visuals', () => {
	beforeEach(() => {
		cy.visit('/')
	})
	it('Login Page', () => {
		cy.compareSnapshot('login-page');
	});


	it('Verify entering wrong email format shows an error', () => {
		cy.get(loginPage.usernameInput).type('invalidEmailFormat123');
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.validationMessage).should('have.text', 'Not a valid email');
	});

	it('Verify empty email and password shows an error', () => {
		cy.get(loginPage.usernameInput).click();
		cy.get(loginPage.passwordInput).click();
		cy.get(loginPage.usernameInput).click();
		cy.get(shared.validationMessage).eq(0).should('have.text', 'This field is required');
		cy.get(shared.validationMessage).eq(1).should('have.text', 'This field is required');
	});

	it('Verify empty password shows an error', () => {
		cy.get(loginPage.usernameInput).type('abc@xyz.co');
		cy.get(loginPage.passwordInput).click();
		cy.get(loginPage.usernameInput).click();
		cy.get(shared.validationMessage).should('have.text', 'This field is required');
	});

	it('Verify clicking on the eye icon should show the password', () => {
		cy.get(loginPage.passwordInput).type('I AM SEEN!');
		cy.get(loginPage.passwordInput).should('have.attr', 'type', 'password');
		cy.get(loginPage.showPasswordIcon).click();
		cy.get(loginPage.passwordInput).should('have.attr', 'type', 'text');
	});

	it('Verify sign-in button is only enabled when email is valid and password is filled', () => {
		// with invalid email format and empty password
		cy.get(loginPage.usernameInput).type('invalidEmailFormat123');
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format and empty password
		cy.get(loginPage.usernameInput).clear().type('abc@xyz.co');
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format and filled password
		cy.get(loginPage.passwordInput).type('Password123');
		cy.get(shared.submitButton).should('be.enabled');
	});

	it('Verify clicking sign-up link should take you to sign-up page', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.compareSnapshot('sign-up-page');
	});

	it('Verify clicking sign-in link should take you to sign-in page', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.get(loginPage.signinLink).click();
		cy.url().should('include', 'sign-in');
	});

	it('Verify clicking forgot password link should take you to forgot password page', () => {
		cy.get(loginPage.forgotPasswordLink).click();
		cy.url().should('include', 'forgot-password');
		cy.compareSnapshot('forgot-password-page');
	});

	it('Verify forgot password field validation', () => {
		cy.get(loginPage.forgotPasswordLink).click();
		// with invalid email format
		cy.get(loginPage.usernameInput).type('invalidEmailFormat123');
		cy.get(shared.body).click();
		cy.get(shared.validationMessage).should('have.text', 'Not a valid email');
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format
		cy.get(loginPage.usernameInput).clear().type('abc@xyz.co');
		cy.get(shared.body).click();
		cy.get(shared.submitButton).should('be.enabled');
	})

	it('Verify clicking back button on forgot password page should take you to sign-in page', () => {
		cy.get(loginPage.forgotPasswordLink).click()
		cy.url().should('include', 'forgot-password');
		cy.get(loginPage.backButton).click()
		cy.url().should('include', 'sign-in');
	});

	it('Verify sign-up button is only enabled when email is valid and password is filled', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		// with invalid email format and empty password
		cy.get(loginPage.usernameInput).type('invalidEmailFormat123');
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled')
		// with valid email format and empty password
		cy.get(loginPage.usernameInput).clear().type('abc@xyz.co');
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format and filled password
		cy.get(loginPage.passwordInput).type('Password123');
		cy.get(shared.submitButton).should('be.enabled');
	});

	it('Verify sign-up password requirements', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.get(loginPage.usernameInput).type('abc@xyz.co');
		// with valid email format and filled password
		cy.get(loginPage.passwordValidation).should('have.length', 0);
		cy.get(shared.submitButton).should('be.disabled');
		// adding one lower case should have one green tick
		cy.get(loginPage.passwordInput).type('a');
		cy.get(loginPage.passwordValidation).should('have.length', 1);
		cy.get(shared.submitButton).should('be.disabled');
		// adding one upper case should have two green tick
		cy.get(loginPage.passwordInput).type('A');
		cy.get(loginPage.passwordValidation).should('have.length', 2);
		cy.get(shared.submitButton).should('be.disabled');
		// adding one number should have three green tick
		cy.get(loginPage.passwordInput).type('1');
		cy.get(loginPage.passwordValidation).should('have.length', 3);
		cy.get(shared.submitButton).should('be.disabled');
		// adding a string with length greater than 8 should have four green tick
		cy.get(loginPage.passwordInput).type('12345');
		cy.get(loginPage.passwordValidation).should('have.length', 4);
		cy.get(shared.submitButton).should('be.enabled');
		cy.compareSnapshot('sign-up-password-page')
	});
});
