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
  created_time: number,
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

export interface UniverseInfo {
  id: string,
  creator_user_id: string,
  universe_name: string,
  created_time: number,
};

export interface CreateUniverseRequest {
  creator_user_id: string,
  universe_name: string,
};

export interface CreateUniverseResponse {
  universeInfo: UniverseInfo,
};

export interface GetUniverseInfoRequest {
  id: string,
};

export interface GetUniverseInfoResponse {
  universeInfo: UniverseInfo,
};

export interface BackendApi {
  genCreateUser: (request: CreateUserRequest) => Promise<CreateUserResponse>,
  genUserInfo: (request: GetUserInfoRequest) => Promise<GetUserInfoResponse>,
  genCreateUniverse: (request: CreateUniverseRequest) => Promise<CreateUniverseResponse>,
  genUniverseInfo: (request: GetUniverseInfoRequest) => Promise<GetUniverseInfoResponse>,
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
