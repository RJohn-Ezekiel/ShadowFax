import { db } from "./firebase.js";
import { ref, push, onChildAdded, set, remove, get, onDisconnect } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let username=localStorage.getItem("shadowfaxUser");
let room=localStorage.getItem("shadowfaxRoom");

const terminal=document.getElementById("terminal");

function log(t){
terminal.innerHTML+=t+"<br>";
terminal.scrollTop=terminal.scrollHeight;
}

let userRef=ref(db,"rooms/"+room+"/users/"+username);

set(userRef,true);

onDisconnect(userRef).remove();

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:username+" joined",
time:Date.now()
});

window.addEventListener("beforeunload",function(){

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:username+" left",
time:Date.now()
});

});

onChildAdded(ref(db,"rooms/"+room+"/messages"),data=>{

let m=data.val();

let d=new Date(m.time);

let ts=`[${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}]`;

log(ts+" "+m.user+": "+m.text);

});

msg.addEventListener("keypress",function(e){

if(e.key==="Enter") send();

});

function send(){

let text=msg.value;

if(text.startsWith("/kick ")){

let u=text.replace("/kick ","");

remove(ref(db,"rooms/"+room+"/users/"+u));

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:u+" kicked",
time:Date.now()
});

}

else{

push(ref(db,"rooms/"+room+"/messages"),{
user:username,
text:text,
time:Date.now()
});

}

msg.value="";

}

document.getElementById("clearChatBtn").onclick=function(){

remove(ref(db,"rooms/"+room+"/messages"));

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:"chat cleared",
time:Date.now()
});

}
