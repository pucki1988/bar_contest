import { showTeams,teams,updateDrinkCounter,showDrinks,drinks,login,logout,addTeam,visitorCount,plusVisitor,minusVisitor,visitors, getVisitorsCount,getVisitorsList } from './firebase.js';


export function showTeamsUI(admin){
  document.addEventListener('load', showTeams(admin),showDrinks(admin));
}



export function showVisitorsUI(){
  document.addEventListener('load', getVisitorsCount(), getVisitorsList());
}

export function showDrinksUI(){
  document.addEventListener('load', showDrinks());
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

  document.getElementById("logged-in").innerHTML='<a class="btn mr-2" id="addTeamModalButton">Neues Team</a>' + user.email + '<input type="submit" id="logout" class="btn ml-1" value="Logout"/>';

  document.getElementById("addTeamModalButton").addEventListener('click', ()=>document.getElementById("add-team-modal").classList.add("active"));
  document.getElementById("add-team-modal-close").addEventListener('click', ()=>document.getElementById("add-team-modal").classList.remove("active"));
  
  document.getElementById("add-drink-modal-close").addEventListener('click', ()=>document.getElementById("add-drink-modal").classList.remove("active"));
  document.getElementById("submit-add-team").addEventListener('click', () => { addTeam(document.getElementById("teamname").value)});

  document.getElementById('logout').addEventListener('click', () => logout());
}



export async function teamUI(change=false){

  //var body='';
  var body='<div class="tile tile-centered bg-secondary mb-1 p-2"><div class="tile-content"><div class="text-bold">Team</div><div class="tile-subtitle"></div></div><div class="tile-action text-bold">Getränke</div></div>';
  var i=0.5;
  var counter=1;
  var anz= teams.length;
  var animation='';

  if(change){
    animation='animation-name: fadeIn;';
  }

  teams.forEach((doc) => {
      body = body + '<div  style="animation-duration:'+i+'s; '+animation+'" class="team tile tile-centered bg-gray mb-2 p-2"><figure class="avatar avatar-lg" data-initial="' + counter + '" style="background-color: #5755d9;border-radius:0 !important;"></figure><div class="tile-content"><div class="text-bold h4">'+ doc.name +'</div><div class="tile-subtitle my-2 mx-1">';
      
      body = body + '<div class="chip"><figure class="avatar avatar-sm" data-initial="" style="background-color: #c7dc43;"></figure>letztes Getränk <input hidden class="lastDrink" id="tdb-'+doc.id+'" value="' + doc.lastDrink.toMillis() + '" /><span class="mx-1" id="tval-'+ doc.id +'"><div class="loading" style="margin-left:.6rem"></div></span></div>';
      body = body + '<div class="chip"><figure class="avatar avatar-sm" data-initial="" style="background-color: #c7dc43;"></figure><input hidden class="startDrinking" id="adb-'+doc.id+'" value="' + doc.startDrinking.toMillis() + '" /><input hidden id="aadb-'+doc.id+'" value="' + doc.anzahl + '" /><span class="mx-1" id="aval-'+ doc.id +'"><div class="loading" style="margin-left:.6rem"></div></span></div>';
      
      body = body + '</div></div><div class="tile-action"><figure class="avatar text-light  avatar-xl bg-dark" data-initial="'+doc.anzahl+'" style="background-color: #c7dc43;border-radius:0 !important;"></figure></div></div>';

      i= i + 0.5;
      anz=anz-1
      counter++;
    });

  document.getElementById("teams").innerHTML=body
  getLastDrink()
  getAverage();

} 


export async function drinkUI(){

  var mix='';
  var menu='';
  var shot =''
  var body='';
  var i=1;
  drinks.forEach((doc) => {

      
          switch(doc.typ){
            case "Mixgetränk":
              mix = mix + '<div class="column col-6 my-2"><div class="card" style="border: 0;box-shadow: 0 .25rem 1rem rgba(48, 55, 66, .15);"><div class="card-header text-center"><div class="card-title h5">'+ doc.name +'</div></div><div class="card-footer text-center"><span class="bg-dark px-2 py-1 h4">€ ' + doc.price.toFixed(2).replace('.',',')+'</span></div></div></div>'
              break;
            case "Shot":
                shot = shot + '<div class="column col-12 my-2"><div class="card bg-dark" style="border: 0;box-shadow: 0 .25rem 1rem rgba(48, 55, 66, .15);"><div class="card-header text-center"><div class="card-title h5">'+ doc.name +'</div><div class="card-subtitle text-gray">' + doc.desc +'</div></div><div class="card-footer text-center"><span class="px-2 py-1 h4 text-dark" style="background-color:#c7dc43">€ ' + doc.price.toFixed(2).replace('.',',')+'</span></div></div></div>'
                break;
            case "Menü":
              menu = menu + '<div class="column col-12 my-2"><div class="card" style="border: 0;box-shadow: 0 .25rem 1rem rgba(48, 55, 66, .15);"><div class="card-header text-center"><div class="card-title h5">'+ doc.name +'</div><div class="card-subtitle text-gray">' + doc.desc +'</div></div><div class="card-footer text-center"><span class="bg-dark px-2 py-1 h4">€ ' + doc.price.toFixed(2).replace('.',',')+'</span></div></div></div>'
              break;
            }
         
            

      
      

      i++;
    });

  document.getElementById("drinks").innerHTML=body + '<div class="columns">' + mix  + '</div>';
  document.getElementById("menu").innerHTML=body + '<div class="columns">' + menu + shot +'</div>';
}




export async function teamAdminUI(){
  var body='';
  var i=1;
  
  teams.forEach((doc) => {
      body = body + '<div id="team-'+i+'" class="column col-3 col-xl-3 col-12 col-lg-4 col-md-6 col-sm-6 col-xs-12 mt-1 px-1"><div class="empty p-2">'
      body = body + '<p class="empty-title h5">'+ doc.name + '</p><div class="empty-action">'
      body = body + '<div class="empty-icon">'
      body = body + '<button id="minus-'+doc.id+'" class="btn btn-error btn-lg minus-drink mr-1"><i class="icon icon-minus"></i></button>'
      body = body + '<figure class="avatar avatar-xl" data-initial="'+doc.anzahl+'" style="background-color: #5755d9;"></figure>'
      body = body + '<button data-long-press-delay="500" id="plus-'+doc.id+'" class="btn btn-success btn-lg plus-drink ml-1"><i class="icon icon-plus"></i></button></div>'
      
     
     
      body = body +  '</div></div></div>'

      i++;
    });

  document.getElementById("teams").innerHTML=body
  

  var minus = document.getElementsByClassName("minus-drink");
  var plus = document.getElementsByClassName("plus-drink");

  for (var i = 0; i < plus.length; i++) {
      plus[i].addEventListener('click', (e)=>{doUpdate(e)});
      plus[i].addEventListener('long-press', (e) =>{showAddDrinksModal(e)});
  }
  for (var i = 0; i < minus.length; i++) {
      minus[i].addEventListener('click', (e)=>{doUpdate(e)});
  }

  fadeIn();

}



export async function visitorCountUI(){
      var body='';
  
      body = body + '<div id="visitor" class="column col-12 mt-1 px-1"><div class="empty p-2">'
      body = body + '<p class="empty-title h5">Besucher</p><div class="empty-action">'
      body = body + '<div class="empty-icon">'
      body = body + '<button id="minus-visitor" class="btn btn-error btn-lg minus-drink mr-1"><i class="icon icon-minus"></i></button>'
      body = body + '<figure class="avatar avatar-xl" data-initial="'+ visitorCount +'" style="background-color: #5755d9;"></figure>'
      body = body + '<button data-long-press-delay="500" id="plus-visitor" class="btn btn-success btn-lg plus-drink ml-1"><i class="icon icon-plus"></i></button></div>'
      
     
     
      body = body +  '</div></div></div>'

      
    

  document.getElementById("visitors-count").innerHTML=body
  
  document.getElementById("minus-visitor").addEventListener('click', (e)=>{minusVisitor()});
  document.getElementById("plus-visitor").addEventListener('click', (e)=>{plusVisitor()});

}


export async function visitorListUI(){
  
  var body='';
  var anz= visitors.length

  body = body + '<div class="column col-12">'
  visitors.forEach((doc) =>  {
    
    body = body + '<div class="tile tile-centered bg-secondary mt-2">'
    body = body + '<div class="tile-icon"><figure class="avatar avatar-lg" style="border-radius:0" data-initial="' + anz +'" style="background-color: #5755d9;"></figure></div>'
    body = body + '<div class="tile-content"><div class="tile-title">' + doc.checkIn + '</div></div>'

    body = body + '</div>'
    anz--;
  });

  body = body + '</div>'


  document.getElementById("visitors-list").innerHTML=body



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

function showAddDrinksModal(e){

  document.getElementById("add-anzahl-teamId").value=''
  document.getElementById("add-anzahl").value=0;
  document.getElementById("add-drink-modal").classList.add("active");

  const isButton = e.target.nodeName === 'BUTTON';
  if(!isButton) {
    document.getElementById("add-anzahl-teamId").value = e.target.parentNode.id;
  }else{
    document.getElementById("add-anzahl-teamId").value=e.target.id;
  }
  document.getElementById("submit-add-drink").addEventListener('click',(e)=>{updateDrinkCounter(document.getElementById("add-anzahl-teamId").value,document.getElementById("add-anzahl").value).then(document.getElementById("add-drink-modal").classList.remove("active"));});
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

    if(document.getElementById(slides.item(i).id.replace("adb-","aadb-")).value ==0){
      document.getElementById(slides.item(i).id.replace("adb-","aval-")).innerHTML =  "keine Angabe ";
    }else{
      var erg=Math.floor(zeitraum/document.getElementById(slides.item(i).id.replace("adb-","aadb-")).value);
      document.getElementById(slides.item(i).id.replace("adb-","aval-")).innerHTML =  "alle " + erg + " Minuten ein Getränk";
    }
    
}
}

