import { loginPage, debtPage, shared } from '../locators';

/**
 * new Account Credentials
 */

const newAccountCredentials = () => {
  return cy.request('http://54.39.177.218:3020/api/v2/test-accounts/free').then(response => {
    expect(response.status).to.be.equal(200);
    return response
  });
};

const createAccountAndSignIn = (credentials) => {
    cy.visit('/')
    cy.get(loginPage.usernameInput).type(credentials.username)
    cy.get(loginPage.passwordInput).type(credentials.password)
    cy.get(shared.submitButton).click()
    cy.wait('@user-data')
    cy.get(loginPage.codeInput).type(credentials.vcode)
    // cy.wait('@workspace');
    cy.get(shared.submitButton).click()
    cy.wait('@user-data');
}

const addDebt = () =>{
    cy.wait('@workspace');
    // cy.wait('@workspace');
    cy.get(debtPage.navbarDebtButton).click();
		cy.wait('@workspace');
		cy.get(debtPage.addDebtButton).eq(1).click({ force: true });
}

const fillDebtInfo = (nickName, currentBalance, annualPercentageRate, minimumPaymentAmount) =>{
    addDebt();
    cy.get(debtPage.nicknameInput).type(nickName);
		cy.get(debtPage.currentBalanceInput).type(currentBalance);
		cy.get(debtPage.annualPercentageRateInput).type(annualPercentageRate);
		cy.get(debtPage.minimumPaymentAmountInput).type(minimumPaymentAmount);
		cy.get(shared.submitButton).click()
		cy.wait('@workspace');
}


module.exports = {
  addDebt,
  createAccountAndSignIn,
  fillDebtInfo,
  newAccountCredentials,
};
