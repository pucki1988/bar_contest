// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"
import { getAuth, signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { collection, query, where, onSnapshot, getDocs, orderBy, updateDoc,doc,increment,serverTimestamp,addDoc,getDoc,getCountFromServer,limit,deleteDoc  } from  "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"


import { teamUI, teamAdminUI, drinkUI,loginUI, visitorCountUI,visitorListUI } from './main.js';

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

export var visitorCount=0;

export const visitors=[];


export const drinks=[];

export async function showTeams(admin = false){
  var q;
  
  if(admin){
    
    q = query(collection(db, "Team"), orderBy("name"));
  }else{
    
    q = query(collection(db, "Team"), orderBy("anzahl","desc"));
  }
  


  

  
    onSnapshot(q, (querySnapshot) => {

      var anzTeamsPre=teams.length;
      var teamsPre=[]
      teamsPre.length=0
      
      teams.forEach(team => {
        teamsPre.push({id:team.id});
      });
      

       teams.length=0;
       querySnapshot.forEach((doc) => {
          teams.push({id:doc.id,name:doc.data().name,anzahl:doc.data().anzahl,lastDrink: doc.data().lastDrink,startDrinking: doc.data().startDrinking});
          
      })
  
      if(admin){
        teamAdminUI();
      }else{


        var change=false;
        if(teamsPre.length>0){
          for(let i=0;i<teams.length;i++){
            
              if(teams[i].id != teamsPre[i].id){
                change=true;
              }
            
          }
        }

        if(teams.length != anzTeamsPre || change){
          console.log("change")
          teamUI(true);
        }else{
          console.log("nochange")
          teamUI();
        }
        
      }
    }); 

    

  }







  export async function updateDrinkCounter(id,inc_anzahl=1){

      const teamDrinks = doc(db, "Team", id.replace('plus-','').replace('minus-',''));

      const docSnap= await getDoc(teamDrinks);
      
      //console.log(docSnap.data().anzahl + inc_anzahl);


      if(id.startsWith('plus-')){
        await updateDoc(teamDrinks, { 
          anzahl: (parseInt(docSnap.data().anzahl) + parseInt(inc_anzahl)),
          lastDrink: serverTimestamp()
        });
      }else
      {
        await updateDoc(teamDrinks, {
          anzahl: increment(-1)
        });
      }   
    }

export async function addTeam(name){
  const docRef = await addDoc(collection(db, "Team"), {
    name: name,
    anzahl: 0,
    lastDrink: serverTimestamp(),
    startDrinking: serverTimestamp()
  }).then(()=>{

    document.getElementById("teamname").value='';
    document.getElementById("add-team-modal").classList.remove("active");
  });

  


  }



export async function showDrinks(admin = false){

  const q = query(collection(db, "Drink"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    drinks.push({id:doc.id,name:doc.data().name,price:doc.data().price,typ:doc.data().typ,desc:doc.data().desc,tipp:doc.data().tipp});
  })

  if(!admin){
  drinkUI();
  }
  
}


export async function login(email,password){
  const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    
    const user = userCredential.user;
    
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}


export async function logout(){
  const auth = getAuth();
  signOut(auth).then(() => {
    loginUI();
  }).catch((error) => {
    
  });
}


/* Visitor Calls */
export async function getVisitorsCount(){
    const coll = collection(db, "Visitor");
    const snapshot = await getCountFromServer(coll);
    visitorCount=snapshot.data().count;
    visitorCountUI();
}

export async function getVisitorsList(){
  const q = query(collection(db, "Visitor"), orderBy("checkIn", "desc"));
  visitors.length=0;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((a) => {

    var dat=new Date(a.data().checkIn.toMillis())


    visitors.push({checkIn: dat.toLocaleString()})
  });

  visitorListUI();
}



export async function plusVisitor(){

  const docRef = await addDoc(collection(db, "Visitor"), {
    checkIn: serverTimestamp(),
  }).then((data)=>{
    getVisitorsCount()
    getVisitorsList()
  })
  .catch((er) =>
    console.log(er)
  );

}

export async function minusVisitor(){
  const q = query(collection(db, "Visitor"), orderBy("checkIn", "desc"), limit(1));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (a) => {
    await deleteDoc(doc(db, "Visitor", a.id)).then(()=>{
      getVisitorsCount();
      getVisitorsList();
    });
  });
}