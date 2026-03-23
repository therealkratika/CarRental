import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

let currentUser = null;

// 🔐 track user properly
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

api.interceptors.request.use(async (config) => {
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;