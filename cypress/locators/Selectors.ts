class Selectors { 
  loginPage = {
    backButton: 'a[class*=mat-button-base]',
    codeInput: '#code0',
    penIconButton: '[class*="fa-pen"]',
    resendCodeMsg: '[mat-dialog-content] > P',
    contactUsButton: '[href^="mailto:support@debtpayoffplanner.com?subject=Debt%20Payoff%20Planner%20support%20request%20for%20verification%"]',
    forgotPasswordLink: '[href="#/public/forgot-password"]',
    passwordInput: '[id*="input_password"]',
    passwordValidation : '.passed',
    showPasswordIcon: '.fa-eye-slash',
    signinLink: '[href="#/public/sign-in"]',
    signupLink: '[href="#/public/sign-up"]',
    usernameInput: '[id*="input_username"]',
  };
  mainPage = {
    addMyFirstDebtButton: '[class*="mat-f"]',
    primaryButton:'[class*="workspace-2"]',
    profileLogo: '[mattooltip="Profile"]',
    navbarHomeButton: '[data-mat-icon-name="logo_bird"]',
    moreButton: 'More'
  }

  shared = {
    body: 'body',
    submitButton: '[type="submit"]',
    validationMessage: 'formly-validation-message',
  }

  debtPage = {
    addDebtButton: '[class^="mat-focus"]',
    annualPercentageRateInput :'[id*="input_no_promo"]',
    currentBalanceInput:'[id*="input_current_balance"]',
    dueDataButton:'[id*="datepicker_next_due_date"]',
    minimumPaymentAmountInput :'[id*="input_minimum_payment_amount"]',
    minimumPaymentTooltip :'.mat-tooltip-trigger',
    minimumPaymentTooltipText :'[class*="mat-tooltip "]',
    navbarDebtButton: '[class*="chart-pie"]',
    nicknameInput: '[id*="input_debt"]',
    previousMonthButton:'[aria-label="Previous month"]',
    calenderDaysButtons: '[class*="cell-content"]',
    oldDataMsg: 'simple-snack-bar > span',
  }
}
export const selectors = new Selectors();
