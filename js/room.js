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

const startTime = Date.now();

/* USER JOIN */

set(ref(db,"users/"+room+"/"+user),true);

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:user+" joined the network",
time:new Date().toLocaleString()
});

/* USER LEAVE */

window.addEventListener("beforeunload",()=>{

remove(ref(db,"users/"+room+"/"+user));

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:user+" left the network",
time:new Date().toLocaleString()
});

});

/* SEND BUTTON */

sendBtn.onclick = sendMessage;

/* ENTER KEY */

msgInput.addEventListener("keydown",function(e){

if(e.key==="Enter"){
sendMessage();
}

});

/* SEND MESSAGE */

function sendMessage(){

let msg = msgInput.value.trim();

if(msg === "") return;

/* COMMAND CHECK */

if(msg.startsWith("/")){
runCommand(msg);
msgInput.value="";
return;
}

/* NORMAL MESSAGE */

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

/* COMMAND ENGINE */

function runCommand(cmd){

let parts = cmd.split(" ");
let command = parts[0];

switch(command){

case "/help":

printSystem("Commands:");
printSystem("/neofetch");
printSystem("/users");
printSystem("/rooms");
printSystem("/whoami");
printSystem("/ping");
printSystem("/uptime");
printSystem("/topic");
printSystem("/msg");
printSystem("/broadcast");
printSystem("/kick");
printSystem("/ban");

break;

/* NEOFETCH */

case "/neofetch":

printSystem(" ");
printSystem("   ███████ ");
printSystem("   ██      ");
printSystem("   █████   ");
printSystem("       ██  ");
printSystem("   █████   ");
printSystem(" ");

printSystem("ShadowFax Network");

printSystem("User: " + user);
printSystem("Room: " + room);
printSystem("Database: Firebase RTDB");
printSystem("Protocol: ShadowFax 1.0");

get(ref(db,"users/"+room)).then(snapshot=>{

let users = Object.keys(snapshot.val() || {});
printSystem("Users Online: " + users.length);

});

break;

/* USERS */

case "/users":

get(ref(db,"users/"+room)).then(snapshot=>{

let users = Object.keys(snapshot.val() || {});
printSystem("Users: " + users.join(", "));

});

break;

/* ROOMS */

case "/rooms":

get(ref(db,"rooms")).then(snapshot=>{

let rooms = Object.keys(snapshot.val() || {});
printSystem("Rooms: " + rooms.join(", "));

});

break;

/* WHOAMI */

case "/whoami":

printSystem("User: " + user);

break;

/* PING */

case "/ping":

printSystem("pong");

break;

/* UPTIME */

case "/uptime":

let sec = Math.floor((Date.now() - startTime)/1000);

printSystem("Uptime: " + sec + " seconds");

break;

/* TOPIC */

case "/topic":

let topic = parts.slice(1).join(" ");

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:"Topic changed to: " + topic,
time:new Date().toLocaleString()
});

break;

/* PRIVATE MESSAGE */

case "/msg":

let target = parts[1];

let message = parts.slice(2).join(" ");

push(ref(db,"messages/"+room),{
user:"PM "+user+" → "+target,
msg:message,
time:new Date().toLocaleString()
});

break;

/* ADMIN COMMANDS */

case "/broadcast":

if(!admin){
printSystem("Admin only command");
return;
}

let bc = parts.slice(1).join(" ");

push(ref(db,"messages/"+room),{
user:"ADMIN",
msg:"[BROADCAST] " + bc,
time:new Date().toLocaleString()
});

break;

case "/kick":

if(!admin){
printSystem("Admin only command");
return;
}

let kickUser = parts[1];

remove(ref(db,"users/"+room+"/"+kickUser));

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:kickUser + " was kicked by admin",
time:new Date().toLocaleString()
});

break;

case "/ban":

if(!admin){
printSystem("Admin only command");
return;
}

let banUser = parts[1];

set(ref(db,"bans/"+room+"/"+banUser),true);

remove(ref(db,"users/"+room+"/"+banUser));

push(ref(db,"messages/"+room),{
user:"SYSTEM",
msg:banUser + " was banned",
time:new Date().toLocaleString()
});

break;

default:

printSystem("Unknown command");

}

}

/* SYSTEM MESSAGE */

function printSystem(text){

let div = document.createElement("div");

div.innerText = "[SYSTEM] " + text;

chatBox.appendChild(div);

chatBox.scrollTop = chatBox.scrollHeight;

}
