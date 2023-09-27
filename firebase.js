// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

import { collection, query, where, onSnapshot, getDocs, orderBy, updateDoc,doc,increment,serverTimestamp  } from  "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"


import { teamUI, teamAdminUI, drinkUI } from './main.js';

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
export const drinks=[];

export async function showTeams(admin = false){
  var q;
  
  if(admin){
    console.log("call admin")
    q = query(collection(db, "Team"), orderBy("name"));
  }else{
    console.log("call main")
    q = query(collection(db, "Team"), orderBy("anzahl","desc"));
  }
  

    onSnapshot(q, (querySnapshot) => {
       teams.length=0;
       querySnapshot.forEach((doc) => {
          teams.push({id:doc.id,name:doc.data().name,anzahl:doc.data().anzahl,lastDrink: doc.data().lastDrink});
          console.log(doc.data())
      })

      if(admin){
        teamAdminUI();
      }else{
        teamUI();
      }
    }); 

    

  }

  export async function updateDrinkCounter(id){

      const teamDrinks = doc(db, "Team", id.replace('plus-','').replace('minus-',''));
      if(id.startsWith('plus-')){
        
        await updateDoc(teamDrinks, {
          anzahl: increment(1),
          lastDrink: serverTimestamp()
        });
      }else
      {
        await updateDoc(teamDrinks, {
          anzahl: increment(-1)
        });
      }   
    }



export async function showDrinks(admin = false){

  const q = query(collection(db, "Drink"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    drinks.push({id:doc.id,name:doc.data().name,price:doc.data().price});
    console.log(doc.id, " => ", doc.data());
  })
  drinkUI();
  
}

