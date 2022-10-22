import { data } from '../src/data';
import { loginPage, shared } from '../locators';

describe('Field validation, login page visuals', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('Verify clicking sign-in link should take you to sign-in page, ID: 11', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.get(loginPage.signinLink).click();
		cy.url().should('include', 'sign-in');
	});

	it('Verify clicking forgot password link should take you to forgot password page, ID: 12', () => {
		cy.get(loginPage.forgotPasswordLink).click();
		cy.url().should('include', 'forgot-password');
		cy.compareSnapshot('forgot-password-page');
	});

	it('Verify forgot password field validation, ID: 13', () => {
		cy.get(loginPage.forgotPasswordLink).click();
		// with invalid email format
		cy.get(loginPage.usernameInput).type(data.invalidEmail);
		cy.get(shared.body).click();
		cy.get(shared.validationMessage).should('have.text', data.invalidEmailMsg);
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format
		cy.get(loginPage.usernameInput).clear().type(data.validEmail);
		cy.get(shared.body).click();
		cy.get(shared.submitButton).should('be.enabled');
	})

	it('Verify clicking back button on forgot password page should take you to sign-in page, ID: 14', () => {
		cy.get(loginPage.forgotPasswordLink).click()
		cy.url().should('include', 'forgot-password');
		cy.get(loginPage.backButton).click()
		cy.url().should('include', 'sign-in');
	});

	it('Verify sign-up button is only enabled when email is valid and password is filled, ID: 15', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		// with invalid email format and empty password
		cy.get(loginPage.usernameInput).type(data.invalidEmail);
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled')
		// with valid email format and empty password
		cy.get(loginPage.usernameInput).clear().type(data.validEmail);
		cy.get(loginPage.passwordInput).click();
		cy.get(shared.submitButton).should('be.disabled');
		// with valid email format and filled password
		cy.get(loginPage.passwordInput).type('Password123');
		cy.get(shared.submitButton).should('be.enabled');
	});

	it('Verify sign-up password requirements, ID: 16', () => {
		cy.get(loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.get(loginPage.usernameInput).type(data.validEmail);
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
