import { selectors } from '../locators/Selectors';

class Utils {
  /**
   * 
   * @returns 
   */
  newAccountCredentials = (): any => {
    return cy.request('http://54.39.177.218:3020/api/v2/test-accounts/free').then(response => {
      expect(response.status).to.be.equal(200);
      return response
    });
  };

  /**
   * 
   * @param credentials 
   */
  createAccountAndSignIn = (credentials: { username: string; password: string; vcode: string; }): void => {
    cy.visit('/')
    cy.get(selectors.loginPage.usernameInput).type(credentials.username)
    cy.get(selectors.loginPage.passwordInput).type(credentials.password)
    cy.get(selectors.shared.submitButton).click()
    cy.wait('@user-data')
    cy.get(selectors.loginPage.codeInput).type(credentials.vcode)
    // cy.wait('@workspace');
    cy.get(selectors.shared.submitButton).click()
    cy.wait('@user-data', { timeout: 30000 });
  }

  /**
   * 
   */
  addDebt = (): void => {
    cy.wait('@workspace');
    // cy.wait('@workspace');
    cy.get(selectors.debtPage.navbarDebtButton).click();
    cy.wait('@workspace');
    cy.get(selectors.debtPage.addDebtButton).eq(1).click({ force: true });
  }

  /**
   * 
   * @param nickName 
   * @param currentBalance 
   * @param annualPercentageRate 
   * @param minimumPaymentAmount 
   */
  fillDebtInfo = (nickName: string, currentBalance: string, annualPercentageRate: string, minimumPaymentAmount: string): void => {
    this.addDebt();
    cy.get(selectors.debtPage.nicknameInput).type(nickName);
    cy.get(selectors.debtPage.currentBalanceInput).type(currentBalance);
    cy.get(selectors.debtPage.annualPercentageRateInput).type(annualPercentageRate);
    cy.get(selectors.debtPage.minimumPaymentAmountInput).type(minimumPaymentAmount);
    cy.get(selectors.shared.submitButton).click()
    cy.wait('@workspace');
  }


  addDebts = (): void => {
    cy.wait('@workspace').then((response)=>{
      const url = (<any>response).response.url;
      const headers = (<any>response).request.headers
      cy.fixture("client").then((body)=>{
        cy.request({
          method: 'PUT',
          url: url,
          body: body,
          headers:headers,
        });
      })
    })
  }

  // signInAndValidateAPI = (credentials: { username: string; password: string; vcode: string; }): void => {
  //   // cy.get(selectors.loginPage.usernameInput).type(credentials.username)
  //   // cy.get(selectors.loginPage.passwordInput).type(credentials.password)
  //   // cy.get(selectors.shared.submitButton).click()
  //   // cy.wait('@user-data')
  //   // cy.get(selectors.loginPage.codeInput).type(credentials.vcode)
  //   // // cy.wait('@workspace');
  //   // cy.get(selectors.shared.submitButton).click()
  //   cy.request('POST', 'http://54.39.177.218:3020/api/v2/auth/signin_new_device', {
  //     "username": credentials.username,
  //     "password": credentials.password,
  //     "device_id": "1b2c0fba-fbc6-4523-8db9-027be9e33e9a"
  //   })
  //   cy.visit('/')
  //   cy.wait('@user-data', { timeout: 30000 });
  // }
}

export const utils = new Utils;
