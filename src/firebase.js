import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_8sdwyi1yrRzsgfQgQkHJAJ1utFh8AzE",
  authDomain: "firechat-ce4f5.firebaseapp.com",
  projectId: "firechat-ce4f5",
  storageBucket: "firechat-ce4f5.appspot.com",
  messagingSenderId: "971633672470",
  appId: "1:971633672470:web:c47996612f42da94429037"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth= getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
