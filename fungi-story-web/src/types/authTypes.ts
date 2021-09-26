export interface AuthConfig {
  signInRoute: string,
  signUpRoute: string,
  signOutRoute: string,
  resetPasswordRoute: string,
  emailVerificationRoute: string,
};

export interface User {
  id: string,
  email: string | null,
  isVerified: boolean,
};
