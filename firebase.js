import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAy5l2ycbWT17mXWiAh_VtzF94T2Dx_Fe0",
  authDomain: "bloomix-oficial-f98ff.firebaseapp.com",
  projectId: "bloomix-oficial-f98ff",
  storageBucket: "bloomix-oficial-f98ff.firebasestorage.app",
  messagingSenderId: "1034656114873",
  appId: "1:1034656114873:web:b20edfca314959d8d01368"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };