import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBpj8bB0wXYlJNI_gqPhwe7wQc4B15dW6M",
  authDomain: "worry-stone.firebaseapp.com",
  projectId: "worry-stone",
  storageBucket: "worry-stone.firebasestorage.app",
  messagingSenderId: "1075285898910",
  appId: "1:1075285898910:web:96704cd0f2ce031077ad8f"
};
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

export const db = getFirestore(app);