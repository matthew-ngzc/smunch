// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smunch-ae2f5.firebaseapp.com",
  projectId: "smunch-ae2f5",
  storageBucket: "smunch-ae2f5.appspot.com",
  messagingSenderId: "1076996043630",
  appId: "1:1076996043630:web:57de8fef4d50e7aa11477f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };