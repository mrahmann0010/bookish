

import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiYFujapY_0VVgPdtzrKOw1UrY6Zxpgfw",
  authDomain: "bookish2-a815d.firebaseapp.com",
  projectId: "bookish2-a815d",
  storageBucket: "bookish2-a815d.appspot.com",
  messagingSenderId: "907259597277",
  appId: "1:907259597277:web:ade2a6e4e4232de262a634",
  measurementId: "G-6K49M2FN01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);

export const db = getFirestore(app);



