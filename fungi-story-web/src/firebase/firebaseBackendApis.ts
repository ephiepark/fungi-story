import { FirebaseApp } from "firebase/app";
import { doc, setDoc, Firestore, getDoc, DocumentSnapshot, DocumentData, getFirestore, addDoc, collection } from "firebase/firestore";
import { firestoreConfig } from './firebaseConfig';

import {
  BackendApi,
  CreateDirectoryRequest,
  CreateDirectoryResponse,
  CreateUserRequest,
  CreateUserResponse,
  DirectoryInfo,
  GetDirectoryInfoRequest,
  GetDirectoryInfoResponse,
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

const getDirectoryInfoFromSnap = (docSnap: DocumentSnapshot<DocumentData>): DirectoryInfo => {
  return {
    id: docSnap.id,
    // @ts-ignore
    creator_user_id: docSnap.data().creator_user_id,
    // @ts-ignore
    directory_name: docSnap.data().directory_name,
    // @ts-ignore
    parent_directory_id: docSnap.data().parent_directory_id,
  }
};

const genCreateDirectory = async (db: Firestore, request: CreateDirectoryRequest): Promise<CreateDirectoryResponse> => {
  const docRef = await addDoc(collection(db, firestoreConfig.collection.directory), {
    creator_user_id: request.creator_user_id,
    directory_name: request.directory_name,
    parent_directory_id: request.parent_directory_id,
  });

  const docSnap = await getDoc(docRef);

  return {
    directoryInfo: getDirectoryInfoFromSnap(docSnap),
  };
};

const genDirectoryInfo = async (db: Firestore, request: GetDirectoryInfoRequest): Promise<GetDirectoryInfoResponse> => {
  const docRef = doc(db, firestoreConfig.collection.user, request.id);
  const docSnap = await getDoc(docRef);
  return {
    directoryInfo: getDirectoryInfoFromSnap(docSnap),
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
    genCreateDirectory: async (request: CreateDirectoryRequest) => {
      return await genCreateDirectory(db, request);
    },
    genDirectoryInfo: async (request: GetDirectoryInfoRequest) => {
      return await genDirectoryInfo(db, request);
    },
  };
};
