import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { app } from "./firebase"; // Ensure this is the correct path to your Firebase config file


const firebaseConfig = {
    apiKey: "AIzaSyAeZBXCFshmFzO9ykWJFkKRzGzLS96VESI",
    authDomain: "webfarm-auth-10223.firebaseapp.com",
    projectId: "webfarm-auth-10223",
    storageBucket: "webfarm-auth-10223.firebasestorage.app",
    messagingSenderId: "387097846454",
    appId: "1:387097846454:web:f172e7ea95d868fb567c17",
    measurementId: "G-9TNBE5HQNG"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
