import { FirebaseApp } from "firebase/app";
import { doc, setDoc, Firestore, getDoc, DocumentSnapshot, DocumentData, getFirestore } from "firebase/firestore";
import { firestoreConfig } from './firestoreConfig';

import {
  BackendApi,
  CreateUserRequest,
  CreateUserResponse,
  GetUserInfoRequest,
  GetUserInfoResponse,
  UserInfo,
} from '../types/apiTypes';

const getUserInfoFromSnap = (docSnap: DocumentSnapshot<DocumentData>): UserInfo => {
  return {
    id: docSnap.id,
    // @ts-ignore
    pen_name: docSnap.data().pen_name,
    // @ts-ignore
    email: docSnap.data().email,
    // @ts-ignore
    personal_directory_id: docSnap.data().personal_directory_id,
  }
};

const genCreateUser = async (db: Firestore, request: CreateUserRequest): Promise<CreateUserResponse> => {
  const docRef = doc(db, firestoreConfig.collection.user, request.id);
  const personal_directory_id = 'asdf'; // genCreatePersonalDirectory(user_id);

  await setDoc(docRef, {
    pen_name: request.pen_name,
    email: request.email,
    personal_directory_id: personal_directory_id,
  });

  const docSnap = await getDoc(docRef);

  return {
    userInfo: getUserInfoFromSnap(docSnap),
  };
};

const genUserInfo = async (db: Firestore, request: GetUserInfoRequest): Promise<GetUserInfoResponse> => {
  const docRef = doc(db, firestoreConfig.collection.user, request.id);
  const docSnap = await getDoc(docRef);
  return {
    userInfo: getUserInfoFromSnap(docSnap),
  };
}

export const initBackendApi = (app: FirebaseApp): BackendApi => {
  const db = getFirestore(app);
  return {
    genCreateUser: async (request: CreateUserRequest) => {
      return await genCreateUser(db, request);
    },
    genUserInfo: async (request: GetUserInfoRequest) => {
      return await genUserInfo(db, request);
    },
  };
};
