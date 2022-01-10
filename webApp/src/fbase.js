import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSjItpacdFMhgCd9MTsm7_-VniH-XYMP8",
  authDomain: "ai-speaker-320402.firebaseapp.com",
  databaseURL: "https://ai-speaker-320402-default-rtdb.firebaseio.com",
  projectId: "ai-speaker-320402",
  storageBucket: "ai-speaker-320402.appspot.com",
  messagingSenderId: "608860827282",
  appId: "1:608860827282:web:552e5f0dbec1861b6fc04b",
  measurementId: "G-DBKGLQMK7X",
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();
