import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence, GoogleAuthProvider } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";


// firebase/auth signInWithPopup doesn't work on RN, need to follow this:
// https://react-native-google-signin.github.io/docs/setting-up/expo
// https://react-native-google-signin.github.io/docs/setting-up/get-config-file
// update: this is a lot, you need to setup RN on ios and android and configure it
// instead we will just store email and password

const firebaseConfig = {
  apiKey: "AIzaSyCTNx0cnXkVMjHmIcCBqPnGdAKd5UooaDM",
  authDomain: "sqrchat-e7443.firebaseapp.com",
  projectId: "sqrchat-e7443",
  storageBucket: "sqrchat-e7443.appspot.com",
  messagingSenderId: "837380904816",
  appId: "1:837380904816:web:896c896216a33c158b61b5"
};

// initialize Firebase App
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getDatabase(app);
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

export { app, auth, db, getApp, getAuth };
