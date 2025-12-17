// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYyOM15HV8gO37Yet2k9XlZLcaTzXAuT0",
  authDomain: "signin-2c352.firebaseapp.com",
  projectId: "signin-2c352",
  storageBucket: "signin-2c352.firebasestorage.app",
  messagingSenderId: "1085152235896",
  appId: "1:1085152235896:web:f7455bf7773d074d39788d",
  measurementId: "G-LRQ6523L12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
