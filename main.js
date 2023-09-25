import { changeRanking } from './firebase.js';

var teams=[];
//document.addEventListener('load', changeRanking());
window.addEventListener('load', (e)=>{changeRanking()});



export async function teamUI(teams){
    var body='<div class="tile tile-centered bg-secondary mb-1 p-2"><div class="tile-content"><div class="text-bold">Team</div><div class="tile-subtitle"></div></div><div class="tile-action text-bold">Drinks</div></div>';
    var i=1;
    teams.forEach((doc) => {
        body = body + '<div class="tile tile-centered bg-gray mb-2 p-2"><div class="tile-content"><div class="text-bold h4">'+ doc.name +'</div><div class="tile-subtitle my-2 mx-1"><div class="chip"><figure class="avatar avatar-sm" data-initial="" style="background-color: #5755d9;"></figure>letzter Drink vor 59 min</div></div></div><div class="tile-action"><figure class="avatar text-light  avatar-xl bg-dark" data-initial="'+doc.anzahl+'" style="background-color: #c7dc43;"></figure></div></div>'

        i++;
      });

    document.getElementById("teams").innerHTML=body

}   