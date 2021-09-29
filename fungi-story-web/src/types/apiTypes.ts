import { User as FirebaseUser, UserCredential } from "firebase/auth";

export interface Unsubscribe {
  (): void;
};

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

export interface UniverseData {
  universe_name: string,
};

export interface UniverseInfo {
  id: string,
  creator_user_id: string,
  created_time: number,
  universe_data: UniverseData,
};

export interface CreateUniverseRequest {
  creator_user_id: string,
  universe_data: UniverseData,
};

export interface CreateUniverseResponse {
  universeInfo: UniverseInfo,
};

export interface UpdateUniverseRequest {
  id: string,
  updater_user_id: string,
  universeData: UniverseData,
};

export interface UpdateUniverseResponse {
  universeInfo: UniverseInfo,
}

export interface GetUniverseInfoRequest {
  id: string,
};

export interface GetUniverseInfoResponse {
  universeInfo: UniverseInfo,
};

export interface GetUniverseInfoListForUserRequest {
  user_id: string,
};

export interface GetUniverseInfoListForUserResponse {
  universeInfoList: Array<UniverseInfo>,
};

export interface BackendApi {
  genCreateUser: (request: CreateUserRequest) => Promise<CreateUserResponse>,
  genUserInfo: (request: GetUserInfoRequest) => Promise<GetUserInfoResponse>,
  genCreateUniverse: (request: CreateUniverseRequest) => Promise<CreateUniverseResponse>,
  genUpdateUniverse: (request: UpdateUniverseRequest) => Promise<UpdateUniverseResponse>,
  genUniverseInfo: (request: GetUniverseInfoRequest) => Promise<GetUniverseInfoResponse>,
  genUniverseInfoListForUser: (request: GetUniverseInfoListForUserRequest) => Promise<GetUniverseInfoListForUserResponse>,
};

export interface SubscribeApi {
  subscribeToUserInfo: (request: GetUserInfoRequest,  cb: (userInfo: UserInfo) => void) => Unsubscribe,
};

export interface AuthApi {
  genSendEmailVerificationToCurrentUser: () => Promise<void>,
  genSendPasswordResetEmail: (email: string) => Promise<void>,
  genSignInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>,
  genSignUpWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>,
  genSignOut: () => Promise<void>,
  genUserFromFirebaseUserNonnull: (user: FirebaseUser) => Promise<UserSession>,
  genUserFromFirebaseUser: (user: FirebaseUser | null) => Promise<UserSession | null>,
}
