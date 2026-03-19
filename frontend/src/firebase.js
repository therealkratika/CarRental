
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDIWJPyNU680Q7zIpoRFFjjOa16E8BkbdQ",
  authDomain: "driveox-24950.firebaseapp.com",
  projectId: "driveox-24950",
  storageBucket: "driveox-24950.firebasestorage.app",
  messagingSenderId: "908348644985",
  appId: "1:908348644985:web:431d38116118edd6ce3ea8",
  measurementId: "G-J9SJNNL6L3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);