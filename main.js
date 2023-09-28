import { showTeams,teams,updateDrinkCounter,showDrinks,drinks,login,logout } from './firebase.js';


export function showTeamsUI(admin){
  document.addEventListener('load', showTeams(admin),showDrinks(admin));
}


export async function loginUI(){

  document.getElementById("teams").innerHTML='';
  document.getElementById("logged-in").innerHTML='';
  var body='<div class="form-group"><label class="form-label" for="input-email">E-Mail</label><input class="form-input" type="email" id="email" placeholder="E-Mail"/></div>';
  body= body + '<div class="form-group"><label class="form-label" for="input-email">Passwort</label><input class="form-input" type="password" id="passwort" placeholder="Passwort"></div>';
  body= body + '<div class="form-group"><input class="btn" type="submit" value="Login" id="submit-login"></div>';
  document.getElementById("login-ui").innerHTML=body;

  document.getElementById("submit-login").addEventListener('click', (e)=>{login(document.getElementById("email").value,document.getElementById("passwort").value)});
  
  
}

export async function showLoggedInUI(user){
  document.getElementById("login-ui").innerHTML='';

  document.getElementById("logged-in").innerHTML=user.email + '<input type="submit" id="logout" class="btn ml-1" value="Logout"/>';

  document.getElementById('logout').addEventListener('click', () => logout());
}



export async function teamUI(){

  //var body='';
  var body='<div class="tile tile-centered bg-secondary mb-1 p-2"><div class="tile-content"><div class="text-bold">Team</div><div class="tile-subtitle"></div></div><div class="tile-action text-bold">Drinks</div></div>';
  var i=1;
  var anz= teams.length;

  teams.forEach((doc) => {
      body = body + '<div  style="animation: fadeIn '+anz+'s;" class="team tile tile-centered bg-gray mb-2 p-2"><div class="tile-content"><div class="text-bold h4">'+ doc.name +'</div><div class="tile-subtitle my-2 mx-1">';
      
      body = body + '<div class="chip"><figure class="avatar avatar-sm" data-initial="" style="background-color: #5755d9;"></figure>letzter Drink <input hidden class="lastDrink" id="tdb-'+doc.id+'" value="' + doc.lastDrink.toMillis() + '" /><span class="mx-1" id="tval-'+ doc.id +'"><div class="loading" style="margin-left:.6rem"></div></span></div>';
      body = body + '<div class="chip"><figure class="avatar avatar-sm" data-initial="" style="background-color: #c7dc43;"></figure>alle <input hidden class="startDrinking" id="adb-'+doc.id+'" value="' + doc.startDrinking.toMillis() + '" /><input hidden id="aadb-'+doc.id+'" value="' + doc.anzahl + '" /><span class="mx-1" id="aval-'+ doc.id +'"><div class="loading" style="margin-left:.6rem"></div></span></div>';
      
      body = body + '</div></div><div class="tile-action"><figure class="avatar text-light  avatar-xl bg-dark" data-initial="'+doc.anzahl+'" style="background-color: #c7dc43;"></figure></div></div>';

      i++;
      anz=anz-1
    });

  document.getElementById("teams").innerHTML=body
  getLastDrink()
  getAverage();

} 


export async function drinkUI(){

  var body='<div class="tile tile-centered bg-secondary mb-1 p-2"><div class="tile-content"><div class="text-bold">Getränk</div><div class="tile-subtitle"></div></div><div class="tile-action text-bold">Preis</div></div>';
  var i=1;
  drinks.forEach((doc) => {
      body = body + '<div class="tile tile-centered bg-gray mb-2 px-2 py-1"><div class="tile-content"><div class="h5">'+ doc.name +'</div></div><div class="tile-action"><div class="h5 text-light bg-dark py-1 px-2">€ ' + doc.price.toFixed(2).replace('.',',')+'</div></div></div>'

      i++;
    });

  document.getElementById("drinks").innerHTML=body
    
}   


export async function teamAdminUI(){
  var body='';
  var i=1;
  
  teams.forEach((doc) => {
      body = body + '<div id="team-'+i+'" class="column col-3 col-xl-3 col-12 col-md-4 col-sm-6 col-xs-12 mb-2 mt-2"><div class="empty">'
      body = body + '<div class="empty-icon">'
      body = body + '<button id="minus-'+doc.id+'" class="btn btn-error btn-lg minus-drink mr-2"><i class="icon icon-minus"></i></button>'
      body = body + '<figure class="avatar avatar-xl" data-initial="'+doc.anzahl+'" style="background-color: #5755d9;"></figure>'
      body = body + '<button id="plus-'+doc.id+'" class="btn btn-success btn-lg plus-drink ml-2"><i class="icon icon-plus"></i></button></div>'
      body = body + '<p class="empty-title h5">'+ doc.name + '</p><div class="empty-action">'
     
     
      body = body +  '</div></div></div>'

      i++;
    });

  document.getElementById("teams").innerHTML=body
  

  var minus = document.getElementsByClassName("minus-drink");
  var plus = document.getElementsByClassName("plus-drink");

  for (var i = 0; i < plus.length; i++) {
      plus[i].addEventListener('click', (e)=>{doUpdate(e)});
  }
  for (var i = 0; i < minus.length; i++) {
      minus[i].addEventListener('click', (e)=>{doUpdate(e)});
  }

  fadeIn();

}



function fadeIn() {
  setInterval(show, 200);
}

function show() {
  var body = document.getElementById("team-1");
  var opacity = 0;
  if (opacity < 1) {
      opacity = 1;
      body.style.opacity = opacity
  } else {
      clearInterval(intervalID);
  }
}


function doUpdate(e)
{
  const isButton = e.target.nodeName === 'BUTTON';

  if(!isButton) {
      updateDrinkCounter(e.target.parentNode.id)
  }else{
      updateDrinkCounter(e.target.id)
  }
  
}

setInterval(()=>{
  getLastDrink()
  getAverage();
}
, 60000);


function getLastDrink(){
  
  var slides = document.getElementsByClassName("lastDrink");
  for (var i = 0; i < slides.length; i++) {
    var minute=Math.floor((Date.now() - slides.item(i).value) / 60000);
    if(minute >=60){
      var hour=Math.floor(minute/60);
      if (hour==1){
        document.getElementById(slides.item(i).id.replace("tdb-","tval-")).innerHTML = "vor über " + hour + " Stunde";
      }else{
        document.getElementById(slides.item(i).id.replace("tdb-","tval-")).innerHTML = "vor über " + hour + " Stunden";
      }
    }else{
      if (minute==1){
        document.getElementById(slides.item(i).id.replace("tdb-","tval-")).innerHTML = "vor " + minute + " Minute";
      }else{
        document.getElementById(slides.item(i).id.replace("tdb-","tval-")).innerHTML = "vor " + minute + " Minuten";
      }
    }

    
    //document.getElementById(slides.item(i).id.replace("tdb-","tval-")).innerHTML = Math.floor((Date.now() - slides.item(i).value) / 60000);
  }


}




function getAverage(){
  var slides = document.getElementsByClassName("startDrinking");
  
  
  
  for (var i = 0; i < slides.length; i++) {
    var zeitraum=Math.floor((Date.now() - slides.item(i).value) / 60000);

    var erg=Math.floor(zeitraum/document.getElementById(slides.item(i).id.replace("adb-","aadb-")).value);
    
    document.getElementById(slides.item(i).id.replace("adb-","aval-")).innerHTML =  erg + " Minuten";

    /*
    if(minute >=60){
      var hour=Math.floor(minute/60);
      if (hour==1){
        document.getElementById(slides.item(i).id.replace("adb-","aval-")).innerHTML = "vor über " + hour + " Stunde";
      }else{
        document.getElementById(slides.item(i).id.replace("adb-","aval-")).innerHTML = "vor über " + hour + " Stunden";
      }
    }else{
      if (minute==1){
        document.getElementById(slides.item(i).id.replace("adb-","aval-")).innerHTML = "vor " + minute + " Minute";
      }else{
        document.getElementById(slides.item(i).id.replace("adb-","aval-")).innerHTML = "vor " + minute + " Minuten";
      }
    }*/
}
}

