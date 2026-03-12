import { db } from "./firebase.js";
import { ref, onChildAdded, set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const roomList = document.getElementById("roomList");
const adminPanel = document.getElementById("adminPanel");

let admin = localStorage.getItem("shadowfaxAdmin") === "true";

if(!admin){
adminPanel.style.display="none";
}

onChildAdded(ref(db,"rooms"),data=>{

let r = data.key;

let div = document.createElement("div");
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

let r = roomname.value;
let p = roompass.value;

set(ref(db,"rooms/"+r),{
pass:p
});

}

}

document.getElementById("themeSelector").onchange=function(){

let t=this.value;

localStorage.setItem("shadowfaxTheme",t);

applyTheme(t);

}

function applyTheme(t){

if(t==="green") document.body.style.color="#00ff00";
if(t==="blue") document.body.style.color="#00aaff";
if(t==="white") document.body.style.color="#ffffff";

}

applyTheme(localStorage.getItem("shadowfaxTheme") || "green");
