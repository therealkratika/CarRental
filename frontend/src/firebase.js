
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/app";

const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "driveox-24950.firebaseapp.com",
  projectId: "driveox-24950",
  storageBucket: "driveox-24950.firebasestorage.app",
  messagingSenderId: "908348644985",
  appId: "APP_ID",
  measurementId: "G-J9SJNNL6L3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
