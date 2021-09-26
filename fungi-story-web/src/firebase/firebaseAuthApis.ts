import { setUser } from '../features/user/userSlice';
import { store } from '../app/store';
import { AuthApi, BackendApi, UserSession } from "../types/apiTypes";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  setPersistence,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  Auth,
  sendPasswordResetEmail
} from "firebase/auth";

export const genSendEmailVerificationToCurrentUser = async (auth: Auth): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser !== null) {
    await sendEmailVerification(currentUser);
  } else {
    throw new Error('Missing current user');
  }
};

export const genSendPasswordResetEmail = async (auth: Auth, email: string): Promise<void> => {
  return await sendPasswordResetEmail(auth, email);
};

export const genSignInWithEmailAndPassword = async (auth: Auth, backendApi: BackendApi, email: string, password: string): Promise<UserSession> => {
  return setPersistence(auth, browserLocalPersistence).then(async () => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return genUserFromFirebaseUserNonnull(backendApi, userCredential.user);
  });
};

export const genSignUpWithEmailAndPassword = async (auth: Auth, backendApi: BackendApi, email: string, password: string): Promise<UserSession> => {
  return setPersistence(auth, browserLocalPersistence).then(async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await genSendEmailVerificationToCurrentUser(auth);
    return genUserFromFirebaseUserNonnull(backendApi, userCredential.user);
  });
};

export const genSignOut = (auth: Auth): Promise<void> => {
  return signOut(auth);
};

export const genUserFromFirebaseUserNonnull = async (backendApi: BackendApi, user: FirebaseUser): Promise<UserSession> => {
  const userInfoResponse = await backendApi.genUserInfo({id: user.uid});
  return {
    id: user.uid,
    isVerified: user.emailVerified,
    userInfo: userInfoResponse.userInfo,
  };
};

export const genUserFromFirebaseUser = async (backendApi: BackendApi, user: FirebaseUser | null): Promise<UserSession | null> => {
  if (user === null) {
    return null;
  }
  return await genUserFromFirebaseUserNonnull(backendApi, user);
};

export const initAuthApi = (auth: Auth, backendApi: BackendApi): AuthApi => {
  onAuthStateChanged(auth, async (user) => {
    const userSession = await genUserFromFirebaseUser(backendApi, user);
    store.dispatch(setUser(userSession));
  });
  return {
    genSendEmailVerificationToCurrentUser: async () => {
      return await genSendEmailVerificationToCurrentUser(auth);
    },
    genSendPasswordResetEmail: async (email: string) => {
      return await genSendPasswordResetEmail(auth, email);
    },
    genSignInWithEmailAndPassword: async (email: string, password: string): Promise<UserSession> => {
      return await genSignInWithEmailAndPassword(auth, backendApi, email, password);
    },
    genSignUpWithEmailAndPassword: async (email: string, password: string): Promise<UserSession> => {
      return await genSignUpWithEmailAndPassword(auth, backendApi, email, password);
    },
    genSignOut: async () => {
      return await genSignOut(auth);
    },
    genUserFromFirebaseUserNonnull: async (user: FirebaseUser): Promise<UserSession> => {
      return genUserFromFirebaseUserNonnull(backendApi, user);
    },
    genUserFromFirebaseUser: async (user: FirebaseUser | null): Promise<UserSession | null> => {
      return genUserFromFirebaseUser(backendApi, user);
    },
  };
};
