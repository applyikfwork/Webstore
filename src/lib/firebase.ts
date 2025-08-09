import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCKXBk8wbIWvO56WX1PjcOvjsTQy_vHZp4",
  authDomain: "myappstore-415x2.firebaseapp.com",
  projectId: "myappstore-415x2",
  storageBucket: "myappstore-415x2.firebasestorage.app",
  messagingSenderId: "916696347768",
  appId: "1:916696347768:web:cc432648bbbe6501b7298d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
