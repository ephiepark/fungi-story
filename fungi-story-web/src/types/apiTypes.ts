import { User as FirebaseUser } from "firebase/auth";

export interface UserSession {
  id: string,
  isVerified: boolean,
  userInfo: UserInfo,
};

export interface UserInfo {
  id: string,
  pen_name: string,
  email: string,
  personal_directory_id: string,
};

export interface CreateUserRequest {
  id: string,
  pen_name: string,
  email: string,
};

export interface CreateUserResponse {
  userInfo: UserInfo,
};

export interface GetUserInfoRequest {
  id: string,
};

export interface GetUserInfoResponse {
  userInfo: UserInfo,
};

export interface BackendApi {
  genCreateUser: (request: CreateUserRequest) => Promise<CreateUserResponse>,
  genUserInfo: (request: GetUserInfoRequest) => Promise<GetUserInfoResponse>,
};

export interface AuthApi {
  genSendEmailVerificationToCurrentUser: () => Promise<void>,
  genSendPasswordResetEmail: (email: string) => Promise<void>,
  genSignInWithEmailAndPassword: (email: string, password: string) => Promise<UserSession>,
  genSignUpWithEmailAndPassword: (email: string, password: string) => Promise<UserSession>,
  genSignOut: () => Promise<void>,
  genUserFromFirebaseUserNonnull: (user: FirebaseUser) => Promise<UserSession>,
  genUserFromFirebaseUser: (user: FirebaseUser | null) => Promise<UserSession | null>,
}
