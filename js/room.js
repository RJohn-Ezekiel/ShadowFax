import { db } from "./firebase.js";

import {
ref,
push,
onChildAdded,
set,
remove,
get
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const msgInput = document.getElementById("msgInput");

let user = localStorage.getItem("shadowfaxUser");
let room = localStorage.getItem("shadowfaxRoom");
let admin = localStorage.getItem("shadowfaxAdmin") === "true";

document.getElementById("roomTitle").innerText = "Room: " + room;

/* USER JOIN */

set(ref(db,"users/"+room+"/"+user),true);

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:user+" joined the network",
time:new Date().toLocaleString()
});

/* REMOVE GHOST USERS ON EXIT */

window.addEventListener("beforeunload",()=>{

remove(ref(db,"users/"+room+"/"+user));

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:user+" left the network",
time:new Date().toLocaleString()
});

});

/* SEND MESSAGE */

sendBtn.onclick = sendMessage;

msgInput.addEventListener("keypress",function(e){
if(e.key==="Enter") sendMessage();
});

function sendMessage(){

let msg = msgInput.value.trim();

if(msg==="") return;

if(msg.startsWith("/")){
runCommand(msg);
msgInput.value="";
return;
}

push(ref(db,"messages/"+room),{
user:user,
msg:msg,
time:new Date().toLocaleString()
});

msgInput.value="";
}

/* DISPLAY MESSAGES */

onChildAdded(ref(db,"messages/"+room),data=>{

let m = data.val();

let div = document.createElement("div");

div.innerText = `[${m.time}] ${m.user}: ${m.msg}`;

chatBox.appendChild(div);

chatBox.scrollTop = chatBox.scrollHeight;

});

/* COMMAND HANDLER */

function runCommand(cmd){

let parts = cmd.split(" ");

switch(parts[0]){

case "/help":

printSystem(
"/users /neofetch /clear /kick /broadcast"
);

break;

/* USERS LIST */

case "/users":

get(ref(db,"users/"+room)).then(snapshot=>{

let list = Object.keys(snapshot.val() || {});

printSystem("Users: "+list.join(", "));

});

break;

/* NEOFETCH */

case "/neofetch":

printSystem(
`ShadowFax Network
User: ${user}
Room: ${room}
System: Firebase RTDB
Protocol: ShadowFax-1.0
Users Online: loading...`
);

break;

/* CLEAR CHAT */

case "/clear":

chatBox.innerHTML="";
break;

/* ADMIN COMMANDS */

case "/broadcast":

if(!admin){
printSystem("Admin only command");
return;
}

let message = parts.slice(1).join(" ");

push(ref(db,"messages/"+room),{
user:"ADMIN",
msg:"[BROADCAST] "+message,
time:new Date().toLocaleString()
});

break;

case "/kick":

if(!admin){
printSystem("Admin only command");
return;
}

let target = parts[1];

remove(ref(db,"users/"+room+"/"+target));

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:target+" was kicked by admin",
time:new Date().toLocaleString()
});

break;

default:

printSystem("Unknown command");

}

}

/* PRINT SYSTEM MESSAGE */

function printSystem(text){

let div = document.createElement("div");

div.innerText = "[SYSTEM] "+text;

chatBox.appendChild(div);

}
