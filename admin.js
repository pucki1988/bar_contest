import { showTeams, updateDrinks } from './firebase.js';

var teams=[];
//document.addEventListener('load', changeRanking());
window.addEventListener('load', (e)=>{showTeams()});


export async function teamAdminUI(teams){
    var body='';
    var i=1;
    teams.forEach((doc) => {
        body = body + '<div class="column col-xl-3 col-12 col-md-6 col-sm-12"><div class="empty">'
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
}


function doUpdate(e)
{
    const isButton = e.target.nodeName === 'BUTTON';
  
    if(!isButton) {
        updateDrinks(e.target.parentNode.id)
    }else{
        updateDrinks(e.target.id)
    }
    
}