import { db } from "./firebase.js";
import { ref, onChildAdded, set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

/* DOM ELEMENTS */

const roomList = document.getElementById("roomList");
const adminPanel = document.getElementById("adminPanel");
const createBtn = document.getElementById("createRoomBtn");

/* ADMIN CHECK */

let admin = localStorage.getItem("shadowfaxAdmin") === "true";

/* HIDE ADMIN PANEL FOR NORMAL USERS */

if(!admin){
adminPanel.style.display = "none";
}

/* LOAD ROOMS */

onChildAdded(ref(db,"rooms"), snapshot => {

let room = snapshot.key;

let div = document.createElement("div");

div.className = "roomItem";

div.innerHTML = `
<span>${room}</span>
<button onclick="joinRoom('${room}')">JOIN</button>
`;

roomList.appendChild(div);

});

/* JOIN ROOM */

window.joinRoom = function(room){

localStorage.setItem("shadowfaxRoom", room);

window.location = "room.html";

}

/* CREATE ROOM (ADMIN ONLY) */

if(admin){

createBtn.onclick = function(){

let r = document.getElementById("roomname").value.trim();
let p = document.getElementById("roompass").value.trim();

if(!r){
alert("enter room name");
return;
}

set(ref(db,"rooms/"+r),{
pass:p
});

};

}

/* THEME SYSTEM */

document.getElementById("themeSelector").onchange = function(){

let theme = this.value;

localStorage.setItem("shadowfaxTheme", theme);

applyTheme(theme);

}

function applyTheme(theme){

if(theme === "green"){
document.body.style.color = "#00ff00";
}

if(theme === "blue"){
document.body.style.color = "#00aaff";
}

if(theme === "white"){
document.body.style.color = "#ffffff";
}

}

/* APPLY SAVED THEME */

applyTheme(localStorage.getItem("shadowfaxTheme") || "green");
