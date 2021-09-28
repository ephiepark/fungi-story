import { FirebaseApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { GetUserInfoRequest, SubscribeApi, UserInfo } from "../types/apiTypes";
import { getUserInfoFromSnap } from "./firebaseBackendApis";
import { firestoreConfig } from "./firebaseConfig";

export const initSubscribeApi = (app: FirebaseApp): SubscribeApi => {
  const db = getFirestore(app);
  return {
    subscribeToUserInfo: (request: GetUserInfoRequest, cb: (userInfo: UserInfo) => void) => {
      const unsub = onSnapshot(doc(db, firestoreConfig.collection.user, request.id), (doc) => {
        if (doc.exists()) {
          cb(getUserInfoFromSnap(doc));
        }
      });
      return unsub;
    },
  };
};
