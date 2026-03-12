import { db } from "./firebase.js";
import { ref, onChildAdded, set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let rooms=document.getElementById("rooms");

onChildAdded(ref(db,"rooms"),data=>{

let r=data.key;

let div=document.createElement("div");

div.innerHTML=r+" <button onclick='joinRoom(\""+r+"\")'>JOIN</button>";

rooms.appendChild(div);

});

window.createRoom=function(){

let r=roomname.value;
let p=roompass.value;

set(ref(db,"rooms/"+r),{
pass:p
});

}

window.joinRoom=function(r){

localStorage.setItem("shadowfaxRoom",r);

window.location="room.html";

}

document.getElementById("theme").onchange=function(){

let t=this.value;

localStorage.setItem("theme",t);

if(t==="blue") document.body.style.color="#00aaff";
if(t==="white") document.body.style.color="#ffffff";
if(t==="green") document.body.style.color="#00ff00";

}
