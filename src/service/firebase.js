import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
    apiKey: "AIzaSyBg8jNKe9qQ0yX63qBZ2eHdvhKj3_S8EXg",
    authDomain: "promotor-1461b.firebaseapp.com",
    databaseURL: "https://promotor-1461b-default-rtdb.firebaseio.com",
    projectId: "promotor-1461b",
    storageBucket: "promotor-1461b.appspot.com",
    messagingSenderId: "312079969983",
    appId: "1:312079969983:web:c3928564d19593dabfa00a"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app); 
export const auth = getAuth(app);

export default app;
