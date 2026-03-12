import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC09ti0mlR9F9VIsN8zlqEQ6efY9R7PHX0",
  authDomain: "shadowfax-1caa3.firebaseapp.com",
  databaseURL: "https://shadowfax-1caa3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shadowfax-1caa3",
  storageBucket: "shadowfax-1caa3.firebasestorage.app",
  messagingSenderId: "399136805462",
  appId: "1:399136805462:web:c60c057b277b16204221f7"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
