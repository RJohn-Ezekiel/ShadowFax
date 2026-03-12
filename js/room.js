import { db } from "./firebase.js";
import { ref,push,onChildAdded,set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

/* SESSION GUARD */

let username=localStorage.getItem("shadowfaxUser");
let room=localStorage.getItem("shadowfaxRoom");

if(!username || !room){

window.location="index.html";

}

const chatBox=document.getElementById("chatBox");

/* timestamp */

function ts(){

let d=new Date();

return `[${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}]`;

}

/* print message */

function log(msg){

chatBox.innerHTML+=msg+"<br>";
chatBox.scrollTop=chatBox.scrollHeight;

}

/* join notice */

push(ref(db,"rooms/"+room+"/messages"),{

user:"system",
text:username+" joined"

});

/* message listener */

onChildAdded(ref(db,"rooms/"+room+"/messages"),data=>{

let m=data.val();

log(`${ts()} ${m.user}: ${m.text}`);

});

/* send message */

window.send=function(){

let text=msg.value;

push(ref(db,"rooms/"+room+"/messages"),{

user:username,
text:text

});

msg.value="";

}

/* clear chat */

window.clearChat=function(){

chatBox.innerHTML="";

}
