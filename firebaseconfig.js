// firebaseconfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7oO65ixmj3uxoUbUOs8CjFOBtUYlmJbo",
  authDomain: "pbpfirebase-f556b.firebaseapp.com",
  projectId: "pbpfirebase-f556b",
  storageBucket: "pbpfirebase-f556b.firebasestorage.app",
  messagingSenderId: "1020822009450",
  appId: "1:1020822009450:web:674fc3f96934779706bc13",
  measurementId: "G-ZSCPFS4G2F"
};

let app;
let auth;


if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);


  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
