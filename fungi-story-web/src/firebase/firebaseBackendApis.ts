import { FirebaseApp } from "firebase/app";
import { doc, setDoc, Firestore, getDoc, DocumentSnapshot, DocumentData, getFirestore, addDoc, collection } from "firebase/firestore";
import { firestoreConfig } from './firebaseConfig';

import {
  BackendApi,
  CreateUniverseRequest,
  CreateUserRequest,
  CreateUserResponse,
  UniverseInfo,
  GetUniverseInfoRequest,
  GetUserInfoRequest,
  GetUserInfoResponse,
  UserInfo,
  CreateUniverseResponse,
  GetUniverseInfoResponse,
} from '../types/apiTypes';

const getUserInfoFromSnap = (docSnap: DocumentSnapshot<DocumentData>): UserInfo => {
  return {
    id: docSnap.id,
    // @ts-ignore
    pen_name: docSnap.data().pen_name,
    // @ts-ignore
    email: docSnap.data().email,
    // @ts-ignore
    created_time: docSnap.data().created_time,
  }
};

const genCreateUser = async (db: Firestore, request: CreateUserRequest): Promise<CreateUserResponse> => {
  const docRef = doc(db, firestoreConfig.collection.user, request.id);

  await setDoc(docRef, {
    pen_name: request.pen_name,
    email: request.email,
    created_time: Date.now(),
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

const getUniverseInfoFromSnap = (docSnap: DocumentSnapshot<DocumentData>): UniverseInfo => {
  return {
    id: docSnap.id,
    // @ts-ignore
    creator_user_id: docSnap.data().creator_user_id,
    // @ts-ignore
    universe_name: docSnap.data().universe_name,
    // @ts-ignore
    created_time: docSnap.data().created_time,
  }
};

const genCreateUniverse = async (db: Firestore, request: CreateUniverseRequest): Promise<CreateUniverseResponse> => {
  const docRef = await addDoc(collection(db, firestoreConfig.collection.universe), {
    creator_user_id: request.creator_user_id,
    universe_name: request.universe_name,
    created_time: Date.now(),
  });

  const docSnap = await getDoc(docRef);

  return {
    universeInfo: getUniverseInfoFromSnap(docSnap),
  };
};

const genUniverseInfo = async (db: Firestore, request: GetUniverseInfoRequest): Promise<GetUniverseInfoResponse> => {
  const docRef = doc(db, firestoreConfig.collection.user, request.id);
  const docSnap = await getDoc(docRef);
  return {
    universeInfo: getUniverseInfoFromSnap(docSnap),
  };
};

export const initBackendApi = (app: FirebaseApp): BackendApi => {
  const db = getFirestore(app);
  return {
    genCreateUser: async (request: CreateUserRequest) => {
      return await genCreateUser(db, request);
    },
    genUserInfo: async (request: GetUserInfoRequest) => {
      return await genUserInfo(db, request);
    },
    genCreateUniverse: async (request: CreateUniverseRequest) => {
      return await genCreateUniverse(db, request);
    },
    genUniverseInfo: async (request: GetUniverseInfoRequest) => {
      return await genUniverseInfo(db, request);
    },
  };
};
