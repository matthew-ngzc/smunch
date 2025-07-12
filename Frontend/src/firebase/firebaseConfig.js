// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smunch-9ea48.firebaseapp.com",
  projectId: "smunch-9ea48",
  storageBucket: "smunch-9ea48.appspot.com",
  messagingSenderId: "322207788670",
  appId: "1:322207788670:web:43b7a6f322cc1506edf22f",
  measurementId: "G-YXMBCTY66S"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export { storage }
