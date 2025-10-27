// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOhVpuiIJJBs9oz3geWZYvgmOXRwqfH2s",
  authDomain: "newproject-162eb.firebaseapp.com",
  projectId: "newproject-162eb",
  storageBucket: "newproject-162eb.appspot.com",
  messagingSenderId: "454123380487",
  appId: "1:454123380487:web:0b012b77dda6dc5b706fa2",
  measurementId: "G-K32WJT1SBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);