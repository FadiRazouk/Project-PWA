import { selectors } from '../locators/Selectors';
import { utils } from '../src/Utils';
import { data } from '../src/Data';

describe('Field validation, login page visuals', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('Verify clicking sign-in link should take you to sign-in page, ID: 11', () => {
		cy.get(selectors.loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.get(selectors.loginPage.signinLink).click();
		cy.url().should('include', 'sign-in');
	});

	it('Verify clicking forgot password link should take you to forgot password page, ID: 12', () => {
		cy.get(selectors.loginPage.forgotPasswordLink).click();
		cy.url().should('include', 'forgot-password');
		cy.compareSnapshot('forgot-password-page', 0);
	});

	it('Verify forgot password field validation, ID: 13', () => {
		cy.get(selectors.loginPage.forgotPasswordLink).click();
		// with invalid email format
		cy.get(selectors.loginPage.usernameInput).type(data.data.invalidEmail);
		cy.get(selectors.shared.body).click();
		cy.get(selectors.shared.validationMessage).should('have.text', data.data.invalidEmailMsg);
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// with valid email format
		cy.get(selectors.loginPage.usernameInput).clear().type(data.data.validEmail);
		cy.get(selectors.shared.body).click();
		cy.get(selectors.shared.submitButton).should('be.enabled');
	})

	it('Verify clicking back button on forgot password page should take you to sign-in page, ID: 14', () => {
		cy.get(selectors.loginPage.forgotPasswordLink).click()
		cy.url().should('include', 'forgot-password');
		cy.get(selectors.loginPage.backButton).click()
		cy.url().should('include', 'sign-in');
	});

	it('Verify sign-up button is only enabled when email is valid and password is filled, ID: 15', () => {
		cy.get(selectors.loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		// with invalid email format and empty password
		cy.get(selectors.loginPage.usernameInput).type(data.data.invalidEmail);
		cy.get(selectors.loginPage.passwordInput).click();
		cy.get(selectors.shared.submitButton).should('be.disabled')
		// with valid email format and empty password
		cy.get(selectors.loginPage.usernameInput).clear().type(data.data.validEmail);
		cy.get(selectors.loginPage.passwordInput).click();
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// with valid email format and filled password
		cy.get(selectors.loginPage.passwordInput).type('Password123');
		cy.get(selectors.shared.submitButton).should('be.enabled');
	});

	it('Verify sign-up password requirements, ID: 16', () => {
		cy.get(selectors.loginPage.signupLink).click();
		cy.url().should('include', 'sign-up');
		cy.get(selectors.loginPage.usernameInput).type(data.data.validEmail);
		// with valid email format and filled password
		cy.get(selectors.loginPage.passwordValidation).should('have.length', 0);
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// adding one lower case should have one green tick
		cy.get(selectors.loginPage.passwordInput).type('a');
		cy.get(selectors.loginPage.passwordValidation).should('have.length', 1);
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// adding one upper case should have two green tick
		cy.get(selectors.loginPage.passwordInput).type('A');
		cy.get(selectors.loginPage.passwordValidation).should('have.length', 2);
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// adding one number should have three green tick
		cy.get(selectors.loginPage.passwordInput).type('1');
		cy.get(selectors.loginPage.passwordValidation).should('have.length', 3);
		cy.get(selectors.shared.submitButton).should('be.disabled');
		// adding a string with length greater than 8 should have four green tick
		cy.get(selectors.loginPage.passwordInput).type('12345');
		cy.get(selectors.loginPage.passwordValidation).should('have.length', 4);
		cy.get(selectors.shared.submitButton).should('be.enabled');
		cy.wait(5000)
		cy.compareSnapshot('sign-up-password-page', 0.04)
	});
});
