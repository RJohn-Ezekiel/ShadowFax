import { db, ref, push, onChildAdded, onValue, set, remove, get, onDisconnect } from "./firebase.js";

const terminal = document.getElementById("chatBox");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");
const themeSelector = document.getElementById("themeSelector");
const neofetch = document.getElementById("neofetch");
const userList = document.getElementById("userList");
const typingBox = document.getElementById("typing");

const username = localStorage.getItem("shadowfaxUser");
const room = localStorage.getItem("shadowfaxRoom");
const admin = localStorage.getItem("shadowfaxAdmin") === "true";

if(!username || !room){
alert("Select a room first");
window.location="dashboard.html";
}

/* TIMESTAMP */

function ts(){
const d = new Date();
return `[${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}]`;
}

/* TERMINAL */

function log(text){
terminal.innerHTML += text+"<br>";
terminal.scrollTop = terminal.scrollHeight;
}

/* FIREBASE PRESENCE */

const connectedRef = ref(db,".info/connected");
const userRef = ref(db,"rooms/"+room+"/users/"+username);

onValue(connectedRef,(snap)=>{

if(snap.val()===true){

onDisconnect(userRef).remove();

set(userRef,true);

/* leave message */

const leaveMsg = push(ref(db,"rooms/"+room+"/messages"));

onDisconnect(leaveMsg).set({
user:"system",
text:username+" left"
});

}

});

/* JOIN MESSAGE */

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:username+" joined"
});

/* LIVE USER LIST */

const usersRef = ref(db,"rooms/"+room+"/users");

let liveUsers = {};

onValue(usersRef,(snap)=>{

liveUsers = snap.val() || {};

if(userList){

userList.innerHTML="";

for(const u in liveUsers){

const li=document.createElement("div");
li.textContent="● "+u;

if(u==="Admin") li.style.color="#00aaff";

userList.appendChild(li);

}

}

});

/* MESSAGES */

onChildAdded(ref(db,"rooms/"+room+"/messages"),data=>{

const m=data.val();

let color="#00ff00";

if(m.user==="system") color="#ff4444";
else if(m.user==="Admin") color="#00aaff";

const formatted=m.text.replace(/\n/g,"<br>");

log(`<span style="color:${color}">${ts()} ${m.user}:</span> ${formatted}`);

});

/* TYPING INDICATOR */

const typingRef = ref(db,"rooms/"+room+"/typing/"+username);

msg.addEventListener("input",()=>{

set(typingRef,true);

setTimeout(()=>{
remove(typingRef);
},2000);

});

onValue(ref(db,"rooms/"+room+"/typing"),snap=>{

const data=snap.val();

if(!data){
typingBox.textContent="";
return;
}

const users=Object.keys(data).filter(u=>u!==username);

if(users.length===0){
typingBox.textContent="";
return;
}

typingBox.textContent=users.join(", ")+" typing...";

});

/* SEND MESSAGE */

function send(){

const text=msg.value.trim();

if(!text) return;

/* ADMIN CLEAR */

if(admin && text==="/clear"){

remove(ref(db,"rooms/"+room+"/messages"));

terminal.innerHTML="";

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:"Admin cleared the chat"
});

}

/* BROADCAST */

else if(admin && text.startsWith("/broadcast ")){

push(ref(db,"rooms/"+room+"/messages"),{
user:"Admin",
text:text.replace("/broadcast ","")
});

}

/* KICK */

else if(admin && text.startsWith("/kick ")){

const target=text.replace("/kick ","");

if(target && liveUsers[target]){

remove(ref(db,"rooms/"+room+"/users/"+target));

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:target+" was kicked"
});

}

}

/* USERS */

else if(text==="/users"){

const list=Object.keys(liveUsers).join(" ");

log(`<span style="color:yellow">${ts()} Users:</span> ${list}`);

}

/* NEOFETCH */

else if(text==="/neofetch"){

neofetch.innerHTML=`<pre>
███████╗
██╔════╝
███████╗   ShadowFax
╚════██║   ----------
███████║   User: ${username}
╚══════╝   Room: ${room}
Backend: Firebase
Admin: ${admin}
</pre>`;

}

/* NORMAL MESSAGE */

else{

push(ref(db,"rooms/"+room+"/messages"),{
user:username,
text:text
});

}

msg.value="";
remove(typingRef);

}

/* SEND BUTTON */

sendBtn.onclick=send;

/* ENTER / SHIFT+ENTER */

msg.addEventListener("keydown",(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();
send();

}

});

/* CLEAR LOCAL */

window.clearChat=function(){
terminal.innerHTML="";
};

/* THEMES */

themeSelector.onchange=function(){

localStorage.setItem("shadowfaxTheme",this.value);
applyTheme(this.value);

};

function applyTheme(t){

if(t==="green") document.body.style.color="#00ff00";
if(t==="blue") document.body.style.color="#00aaff";
if(t==="white") document.body.style.color="#ffffff";

}

applyTheme(localStorage.getItem("shadowfaxTheme") || "green");
