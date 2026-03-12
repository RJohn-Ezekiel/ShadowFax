import { db } from "./firebase.js";
import { ref,push,onChildAdded,set,remove,get }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let user=localStorage.getItem("shadowfaxUser");
let room=localStorage.getItem("shadowfaxRoom");
let admin=localStorage.getItem("shadowfaxAdmin")==="true";

roomTitle.innerText="Room: "+room;

/* timestamp */

function ts(){

let d=new Date();

let day=String(d.getDate()).padStart(2,'0');
let month=String(d.getMonth()+1).padStart(2,'0');
let year=d.getFullYear();

let h=String(d.getHours()).padStart(2,'0');
let m=String(d.getMinutes()).padStart(2,'0');

return day+"/"+month+"/"+year+" "+h+":"+m;

}

/* system message */

function system(msg){

push(ref(db,"messages/"+room),{

user:"SYSTEM",
msg:msg,
time:ts()

});

}

/* register user */

set(ref(db,"users/"+room+"/"+user),true);

system(user+" joined");

/* remove user on exit */

window.addEventListener("beforeunload",()=>{

remove(ref(db,"users/"+room+"/"+user));

system(user+" left");

});

/* send message */

sendBtn.onclick=send;

msgInput.addEventListener("keypress",e=>{
if(e.key==="Enter") send();
});

function send(){

let msg=msgInput.value.trim();

if(msg==="") return;

if(msg.startsWith("/")){
command(msg);
msgInput.value="";
return;
}

/* normal chat */

push(ref(db,"messages/"+room),{

user:user,
msg:msg,
time:ts()

});

msgInput.value="";

}

/* command system */

function command(cmd){

let p=cmd.split(" ");

/* ping */

if(cmd==="/ping"){
print("SYSTEM","pong");
return;
}

/* user list */

if(cmd==="/users"){

get(ref(db,"users/"+room)).then(s=>{

let u=Object.keys(s.val()||{});

print("SYSTEM","Users: "+u.join(", "));

});

return;

}

/* neofetch */

if(cmd==="/neofetch"){

print("SYSTEM","S");
print("SYSTEM","ShadowFax Network");
print("SYSTEM","User: "+user);
print("SYSTEM","Room: "+room);
print("SYSTEM","Admin: "+admin);

return;

}

/* topic view */

if(cmd==="/topic"){

get(ref(db,"topics/"+room)).then(s=>{

print("SYSTEM","Topic: "+(s.val()||"none"));

});

return;

}

/* PRIVATE MESSAGE */

if(p[0]==="/msg"){

let target=p[1];
let message=p.slice(2).join(" ");

if(!target || message===""){
print("SYSTEM","Usage: /msg username message");
return;
}

/* send PM */

push(ref(db,"private/"+target),{

from:user,
msg:message,
time:ts()

});

print("SYSTEM","PM to "+target+": "+message);

return;

}

/* admin commands */

if(!admin){

print("SYSTEM","Permission denied");
return;

}

/* change topic */

if(p[0]==="/topic"){

let t=p.slice(1).join(" ");

set(ref(db,"topics/"+room),t);

system("Topic changed to "+t);

}

/* kick user */

if(p[0]==="/kick"){

remove(ref(db,"users/"+room+"/"+p[1]));

system(p[1]+" was kicked");

}

/* broadcast */

if(p[0]==="/broadcast"){

let m=p.slice(1).join(" ");

push(ref(db,"messages/"+room),{

user:"ADMIN",
msg:"[BROADCAST] "+m,
time:ts()

});

}

}

/* print local message */

function print(u,m){

let div=document.createElement("div");

let color="lime";

if(u==="SYSTEM") color="red";
if(u==="ADMIN") color="deepskyblue";

div.innerHTML="["+ts()+"] <span style='color:"+color+"'>"+u+"</span>: "+m;

chatBox.appendChild(div);

}

/* room messages */

onChildAdded(ref(db,"messages/"+room),snap=>{

let m=snap.val();

let color="lime";

if(m.user==="SYSTEM") color="red";
if(m.user==="ADMIN") color="deepskyblue";

let div=document.createElement("div");

div.innerHTML="["+m.time+"] <span style='color:"+color+"'>"+m.user+"</span>: "+m.msg;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

});

/* receive private messages */

onChildAdded(ref(db,"private/"+user),snap=>{

let m=snap.val();

let div=document.createElement("div");

div.style.color="orange";

div.innerHTML="["+m.time+"] PM from "+m.from+": "+m.msg;

chatBox.appendChild(div);

});

/* clear chat */

clearBtn.onclick=function(){

if(admin)
remove(ref(db,"messages/"+room));

}
