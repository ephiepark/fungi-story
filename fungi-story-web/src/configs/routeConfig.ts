export interface RouteConfig {
  signInRoute: string,
  signUpRoute: string,
  signOutRoute: string,
  resetPasswordRoute: string,
  emailVerificationRoute: string,
};

export const routeConfig = {
  signInRoute: 'signin',
  signUpRoute: 'signup',
  signOutRoute: 'signout',
  resetPasswordRoute: 'resetpassword',
  emailVerificationRoute: 'emailverification',
};
