// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import firebaseConfig from "../firebase/firebaseConfig";
import { initBackendApi } from '../backend/api';
import { getAuth } from "firebase/auth";
import { initAuthApi } from './firebaseAuthApis';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export const backendApi = initBackendApi(app);
export const authApi = initAuthApi(auth, backendApi);
