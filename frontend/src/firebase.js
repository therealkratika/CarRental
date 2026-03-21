// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBVfriaOdMRvOykDrpeOtRj9qALmI42oBk",
  authDomain: "carrental-88a30.firebaseapp.com",
  projectId: "carrental-88a30",
  storageBucket: "carrental-88a30.firebasestorage.app",
  messagingSenderId: "923905777805",
  appId: "1:923905777805:web:0704840ac0bf63725682c4",
  measurementId: "G-36T7Y0VTN6"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);