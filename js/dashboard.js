import { db } from "./firebase.js";
import { ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let user=localStorage.getItem("shadowfaxUser");
let admin=(localStorage.getItem("shadowfaxAdmin")==="true");

const roomsDiv=document.getElementById("rooms");

onValue(ref(db,"rooms"),snap=>{

roomsDiv.innerHTML="";

let rooms=snap.val();

for(let r in rooms){

let users=rooms[r].users?Object.keys(rooms[r].users).length:0;

let div=document.createElement("div");

div.innerHTML=`${r} | users:${users}
<button onclick="enterRoom('${r}')">JOIN</button>
${admin?`<button onclick="deleteRoom('${r}')">DELETE</button>`:""}`;

roomsDiv.appendChild(div);

}

});

window.enterRoom=function(room){

localStorage.setItem("shadowfaxRoom",room);
window.location="room.html";

}

window.deleteRoom=function(room){

if(confirm("Delete room "+room+"?")){
remove(ref(db,"rooms/"+room));
}

}

window.createRoom=function(){

let room=document.getElementById("newroom").value;
let pass=document.getElementById("roompass").value;

set(ref(db,"rooms/"+room+"/pass"),pass);

}