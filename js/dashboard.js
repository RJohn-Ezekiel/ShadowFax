import { db } from "./firebase.js";
import { ref,onChildAdded,set }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let admin=localStorage.getItem("shadowfaxAdmin")==="true";

if(!admin)
adminPanel.style.display="none";

onChildAdded(ref(db,"rooms"),snap=>{

let room=snap.key;

let div=document.createElement("div");

div.className="roomItem";

div.innerHTML=
room+" <button onclick='joinRoom(\""+room+"\")'>JOIN</button>";

roomList.appendChild(div);

});

window.joinRoom=function(r){

localStorage.setItem("shadowfaxRoom",r);

window.location="room.html";

}

createRoomBtn.onclick=function(){

if(!admin) return;

let r=roomname.value;

set(ref(db,"rooms/"+r),true);

}
