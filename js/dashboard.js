import { db } from "./firebase.js";

import { ref,onChildAdded,set }

from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const roomList=document.getElementById("roomList");

const adminPanel=document.getElementById("adminPanel");

let admin=localStorage.getItem("shadowfaxAdmin")==="true";

if(!admin){
adminPanel.style.display="none";
}

onChildAdded(ref(db,"rooms"),data=>{

let r=data.key;

let div=document.createElement("div");

div.className="roomItem";

div.innerHTML=`

<span>${r}</span>

<button onclick="joinRoom('${r}')">JOIN</button>

`;

roomList.appendChild(div);

});

window.joinRoom=function(r){

localStorage.setItem("shadowfaxRoom",r);

window.location="room.html";

}

if(admin){

document.getElementById("createRoomBtn").onclick=function(){

let r=document.getElementById("roomname").value;

let p=document.getElementById("roompass").value;

set(ref(db,"rooms/"+r),{

pass:p

});

}

}
