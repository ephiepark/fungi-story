import { FirebaseApp } from "firebase/app";
import { doc, setDoc, Firestore, getDoc, DocumentSnapshot, DocumentData, getFirestore, addDoc, collection, where, query, getDocs, onSnapshot } from "firebase/firestore";
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
  GetUniverseInfoListForUserRequest,
  GetUniverseInfoListForUserResponse,
  UpdateUniverseRequest,
  UpdateUniverseResponse,
  CharacterInfo,
  GetCharacterListForUniverseRequest,
  GetCharacterListForUniverseResponse,
} from '../types/apiTypes';

export const getUserInfoFromSnap = (docSnap: DocumentSnapshot<DocumentData>): UserInfo => {
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
    created_time: docSnap.data().created_time,
    universe_data: {
      // @ts-ignore
      universe_name: docSnap.data().universe_name,
    },
  }
};

const genCreateUniverse = async (db: Firestore, request: CreateUniverseRequest): Promise<CreateUniverseResponse> => {
  const docRef = await addDoc(collection(db, firestoreConfig.collection.universe), {
    creator_user_id: request.creator_user_id,
    universe_name: request.universe_data.universe_name,
    created_time: Date.now(),
  });

  const docSnap = await getDoc(docRef);

  return {
    universeInfo: getUniverseInfoFromSnap(docSnap),
  };
};

const genUpdateUniverse = async (db: Firestore, request: UpdateUniverseRequest): Promise<UpdateUniverseResponse> => {
  const docRef = doc(db, firestoreConfig.collection.universe, request.id);

  await setDoc(docRef, {
    universe_name: request.universeData.universe_name,
  }, { merge: true });

  const docSnap = await getDoc(docRef);

  return {
    universeInfo: getUniverseInfoFromSnap(docSnap),
  };
};

const genUniverseInfo = async (db: Firestore, request: GetUniverseInfoRequest): Promise<GetUniverseInfoResponse> => {
  const docRef = doc(db, firestoreConfig.collection.universe, request.id);
  const docSnap = await getDoc(docRef);
  return {
    universeInfo: getUniverseInfoFromSnap(docSnap),
  };
};

const genUniverseInfoListForUser = async (db: Firestore, request: GetUniverseInfoListForUserRequest): Promise<GetUniverseInfoListForUserResponse> => {
  const q = query(collection(db, firestoreConfig.collection.universe), where("creator_user_id", "==", request.user_id));
  const querySnapshot = await getDocs(q);
  const universeInfoList: Array<UniverseInfo> = [];
  querySnapshot.forEach((doc) => {
    universeInfoList.push(getUniverseInfoFromSnap(doc));
  });
  return {
    universeInfoList: universeInfoList,
  };
};

const getCharacterInfoFromSnap = (docSnap: DocumentSnapshot<DocumentData>): CharacterInfo => {
  return {
    id: docSnap.id,
    // @ts-ignore
    universeId: docSnap.data().universeId,
    // @ts-ignore
    creatorUserId: docSnap.data().creatorUserId,
    // @ts-ignore
    createdTime: docSnap.data().createdTime,
    characterData: {
      // @ts-ignore
      characterName: docSnap.data().characterData.characterName,
      // @ts-ignore
      characterSummary: docSnap.data().characterData.characterSummary,
    },
  }
};

const genCharacterInfoListForUniverse = async (db: Firestore, request: GetCharacterListForUniverseRequest): Promise<GetCharacterListForUniverseResponse> => {
  const q = query(collection(db, firestoreConfig.collection.character), where("universeId", "==", request.universeId));
  const querySnapshot = await getDocs(q);
  const characterInfoList: Array<CharacterInfo> = [];
  querySnapshot.forEach((doc) => {
    characterInfoList.push(getCharacterInfoFromSnap(doc));
  });
  return {
    characterInfoList: characterInfoList,
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
    genUpdateUniverse: async (request: UpdateUniverseRequest) => {
      return await genUpdateUniverse(db, request);
    },
    genUniverseInfo: async (request: GetUniverseInfoRequest) => {
      return await genUniverseInfo(db, request);
    },
    genUniverseInfoListForUser: async (request: GetUniverseInfoListForUserRequest) => {
      return await genUniverseInfoListForUser(db, request);
    },
    genCharacterInfoListForUniverse: async (request: GetCharacterListForUniverseRequest) => {
      return await genCharacterInfoListForUniverse(db, request);
    },
  };
};
