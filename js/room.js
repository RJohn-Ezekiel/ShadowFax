import { db } from "./firebase.js";

import { ref,push,onChildAdded,remove }

from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const chatBox=document.getElementById("chatBox");

const sendBtn=document.getElementById("sendBtn");

const clearBtn=document.getElementById("clearBtn");

const msgInput=document.getElementById("msgInput");

let user=localStorage.getItem("shadowfaxUser");

let room=localStorage.getItem("shadowfaxRoom");

document.getElementById("roomTitle").innerText="Room: "+room;

sendBtn.onclick=function(){

let msg=msgInput.value;

push(ref(db,"messages/"+room),{

user:user,

msg:msg,

time:new Date().toLocaleString()

});

msgInput.value="";

}

onChildAdded(ref(db,"messages/"+room),data=>{

let m=data.val();

let div=document.createElement("div");

div.innerText=`[${m.time}] ${m.user}: ${m.msg}`;

chatBox.appendChild(div);

});

clearBtn.onclick=function(){

remove(ref(db,"messages/"+room));

chatBox.innerHTML="";

}
