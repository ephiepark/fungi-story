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

export interface DirectoryInfo {
  id: string,
  creator_user_id: string,
  parent_directory_id: string | null,
  directory_name: string,
};

export interface CreateDirectoryRequest {
  creator_user_id: string,
  parent_directory_id: string | null,
  directory_name: string,
};

export interface CreateDirectoryResponse {
  directoryInfo: DirectoryInfo,
};

export interface GetDirectoryInfoRequest {
  id: string,
};

export interface GetDirectoryInfoResponse {
  directoryInfo: DirectoryInfo,
};

export interface BackendApi {
  genCreateUser: (request: CreateUserRequest) => Promise<CreateUserResponse>,
  genUserInfo: (request: GetUserInfoRequest) => Promise<GetUserInfoResponse>,
  genCreateDirectory: (request: CreateDirectoryRequest) => Promise<CreateDirectoryResponse>,
  genDirectoryInfo: (request: GetDirectoryInfoRequest) => Promise<GetDirectoryInfoResponse>,
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
