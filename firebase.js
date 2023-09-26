// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

import { collection, query, where, onSnapshot, getDocs, orderBy, updateDoc,doc,increment } from  "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"


//import { teamUI } from './main.js';
//import { teamAdminUI } from './admin.js';
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

export const teams=[];

export async function showTeams(admin = false){
  var q;
  if(admin){
    q = query(collection(db, "Team"), orderBy("name"));
  }else{
    q = query(collection(db, "Team"), orderBy("anzahl","desc"));
  }
  
  var unsubscribe  = onSnapshot(q, (querySnapshot) => {
      
      querySnapshot.forEach((doc) => {
          teams.push({id:doc.id,name:doc.data().name,anzahl:doc.data().anzahl});
          console.log(doc.id)
      })
      
    }); 

    return 0;
  }

  export async function updateDrinks(id){

      const teamDrinks = doc(db, "Team", id.replace('plus-','').replace('minus-',''));
      if(id.startsWith('plus-')){
        
        await updateDoc(teamDrinks, {
          anzahl: increment(1)
        });
      }else
      {
        await updateDoc(teamDrinks, {
          anzahl: increment(-1)
        });
      }   
    }


