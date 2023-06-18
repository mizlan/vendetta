/* taken from TLA frontend */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  NextOrObserver,
  User,
} from 'firebase/auth';

const getConfig = () => {
  let config = {
    apiKey: 'AIzaSyD6a3Br7b52N2c6MjZTu1UU0ssf3ZwbfoA',
    authDomain: 'tla-editor-backend-staging.firebaseapp.com',
    databaseURL: 'https://tla-editor-backend-staging.firebaseio.com',
    projectId: 'tla-editor-backend-staging',
    storageBucket: 'tla-editor-backend-staging.appspot.com',
    messagingSenderId: '665461655548',
    appId: '1:665461655548:web:146e120e8b12f433429479',
  };
  if (import.meta.env.PROD) {
    config = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG!);
  }
  return config;
};

const firebaseApp = initializeApp(getConfig());
const auth = getAuth(firebaseApp);
const onAuthStateChangedFn = (fn: NextOrObserver<User>) => onAuthStateChanged(auth, fn);
const signOutFn = () => signOut(auth);
const createUserWithEmailAndPasswordFn = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
const signInWithEmailAndPasswordFn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
const signInAnonymouslyFn = () => signInAnonymously(auth);

export {
  onAuthStateChangedFn as onAuthStateChanged,
  signOutFn as signOut,
  createUserWithEmailAndPasswordFn as createUserWithEmailAndPassword,
  signInWithEmailAndPasswordFn as signInWithEmailAndPassword,
  signInAnonymouslyFn as signInAnonymously,
};
