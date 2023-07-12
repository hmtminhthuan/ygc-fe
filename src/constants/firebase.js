// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKPQvbwWf_5mdzjfR5jLbCTZqxTuoinWU",
  authDomain: "yogacenter-66b48.firebaseapp.com",
  projectId: "yogacenter-66b48",
  storageBucket: "yogacenter-66b48.appspot.com",
  messagingSenderId: "783554317293",
  appId: "1:783554317293:web:2b7f9bede027ca547635e4",
  measurementId: "G-FZ6SXDQFQT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
