import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBGlBBG_nKas8XASUMCtxBoGRea_xoU8h4",
    authDomain: "promotor-243aa.firebaseapp.com",
    projectId: "promotor-243aa",
    storageBucket: "promotor-243aa.appspot.com",
    messagingSenderId: "283546476671",
    appId: "1:283546476671:web:3fc3b6126bcff123c6df4a"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);

export default app;
