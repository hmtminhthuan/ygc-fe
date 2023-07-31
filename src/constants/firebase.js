import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKPQvbwWf_5mdzjfR5jLbCTZqxTuoinWU",
  authDomain: "yogacenter-66b48.firebaseapp.com",
  projectId: "yogacenter-66b48",
  storageBucket: "yogacenter-66b48.appspot.com",
  messagingSenderId: "783554317293",
  appId: "1:783554317293:web:2b7f9bede027ca547635e4",
  measurementId: "G-FZ6SXDQFQT",
  databaseURL:
    "https://yogacenter-66b48-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
