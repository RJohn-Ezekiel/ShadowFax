import { db } from "./firebase.js";
import { ref,onChildAdded,set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let username=localStorage.getItem("shadowfaxUser");

if(!username){

window.location="index.html";

}

let admin=localStorage.getItem("shadowfaxAdmin")==="true";

const roomList=document.getElementById("roomList");
const adminPanel=document.getElementById("adminPanel");

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

let r=roomname.value;
let p=roompass.value;

set(ref(db,"rooms/"+r),{
pass:p
});

}

}
