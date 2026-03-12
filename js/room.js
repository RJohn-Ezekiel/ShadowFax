import { db } from "./firebase.js";
import { ref, push, onChildAdded, set, remove, get, onValue }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let user=localStorage.getItem("shadowfaxUser");
let room=localStorage.getItem("shadowfaxRoom");
let admin=localStorage.getItem("shadowfaxAdmin")==="true";

roomTitle.innerText="Room: "+room;

function ts(){

let d=new Date();

let day=String(d.getDate()).padStart(2,'0');
let month=String(d.getMonth()+1).padStart(2,'0');
let year=d.getFullYear();

let h=String(d.getHours()).padStart(2,'0');
let m=String(d.getMinutes()).padStart(2,'0');

return `${day}/${month}/${year} ${h}:${m}`;

}

function sys(msg){

push(ref(db,"messages/"+room),{

user:"SYSTEM",
msg:msg,
time:ts()

});

}

set(ref(db,"users/"+room+"/"+user),true);

sys(user+" joined");

window.addEventListener("beforeunload",()=>{

remove(ref(db,"users/"+room+"/"+user));

sys(user+" left");

});

sendBtn.onclick=send;

msgInput.addEventListener("keypress",e=>{

if(e.key==="Enter") send();

});

function send(){

let msg=msgInput.value;

if(msg.startsWith("/")){

runCommand(msg);

msgInput.value="";
return;

}

push(ref(db,"messages/"+room),{

user:user,
msg:msg,
time:ts()

});

msgInput.value="";

}

function runCommand(cmd){

let p=cmd.split(" ");

if(cmd==="/ping"){

print("SYSTEM","pong");

return;

}

if(cmd==="/users"){

get(ref(db,"users/"+room)).then(s=>{

let u=Object.keys(s.val()||{});

print("SYSTEM","Users: "+u.join(", "));

});

return;

}

if(cmd==="/neofetch"){

print("SYSTEM"," S");
print("SYSTEM","ShadowFax Network");
print("SYSTEM","User: "+user);
print("SYSTEM","Room: "+room);
print("SYSTEM","Admin: "+admin);

return;

}

if(cmd==="/topic"){

get(ref(db,"topics/"+room)).then(s=>{

print("SYSTEM","Topic: "+(s.val()||"none"));

});

return;

}

if(!admin){

print("SYSTEM","permission denied");

return;

}

if(p[0]==="/topic"){

let t=p.slice(1).join(" ");

set(ref(db,"topics/"+room),t);

sys("Topic changed to "+t);

}

if(p[0]==="/kick"){

remove(ref(db,"users/"+room+"/"+p[1]));

sys(p[1]+" was kicked");

}

if(p[0]==="/broadcast"){

let m=p.slice(1).join(" ");

push(ref(db,"messages/"+room),{

user:"ADMIN",
msg:"[BROADCAST] "+m,
time:ts()

});

}

}

function print(u,m){

let div=document.createElement("div");

let color="lime";

if(u==="SYSTEM") color="red";
if(u==="ADMIN") color="deepskyblue";

div.innerHTML=`[${ts()}] <span style="color:${color}">${u}</span>: ${m}`;

chatBox.appendChild(div);

}

onChildAdded(ref(db,"messages/"+room),snap=>{

let m=snap.val();

let color="lime";

if(m.user==="SYSTEM") color="red";
if(m.user==="ADMIN") color="deepskyblue";

let div=document.createElement("div");

div.innerHTML=`[${m.time}] <span style="color:${color}">${m.user}</span>: ${m.msg}`;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

});

clearBtn.onclick=function(){

if(admin) remove(ref(db,"messages/"+room));

}
