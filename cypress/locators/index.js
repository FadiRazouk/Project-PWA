const getByIconName = (iconName) => `[data-mat-icon-name="${iconName}"]`;

export default {
  loginPage: {
    usernameInput: '[id*="input_username"]',
    passwordInput: '[id*="input_password"]',
    codeInput: '#code0',
    signupLink: '[href="#/public/sign-up"]',
    signinLink: '[href="#/public/sign-in"]',
    forgotPasswordLink: '[href="#/public/forgot-password"]',
    showPasswordIcon: '.fa-eye-slash',
    backButton: 'a[class*=mat-button-base]',
    passwordValidation : '.passed'
  },
  mainPage: {
    profileLogo: '[mattooltip="Profile"]',
    addMyFirstDebtButton: '[class*="mat-f"]',
    primaryButton:'[class*="workspace-2"]',
  },

  shared:{
    validationMessage: 'formly-validation-message',
    submitButton: '[type="submit"]',
    body: 'body'
  },

  debtPage:{
    addDebtButton: '[class^="mat-focus"]',
    navbarDebtButton: '[class*="chart-pie"]',
    nicknameInput: '[id*="input_debt"]',
    currentBalanceInput:'[id*="input_current_balance"]',
    annualPercentageRateInput :'[id*="input_no_promo"]',
    minimumPaymentAmountInput :'[id*="input_minimum_payment_amount"]',
    
  },
};
