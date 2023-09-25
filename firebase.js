// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

import { collection, query, where, onSnapshot, getDocs, orderBy } from  "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"


import { teamUI } from './main.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvGsIMC3L6OIt0dpecpR7D-Yc6dB24RS8",
  authDomain: "bar-contest.firebaseapp.com",
  projectId: "bar-contest",
  storageBucket: "bar-contest.appspot.com",
  messagingSenderId: "601029126652",
  appId: "1:601029126652:web:af1a4bbfa888b38888aa79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function changeRanking(){
const q = query(collection(db, "Team"), orderBy("anzahl","desc"));
  return onSnapshot(q, (querySnapshot) => {
    const teams = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.data().anzahl)
        teams.push({id:doc.id,name:doc.data().name,anzahl:doc.data().anzahl});
    });
    
    teamUI(teams);
  });
  ;

}
