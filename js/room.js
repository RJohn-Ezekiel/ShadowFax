import { db, ref, push, onChildAdded, set, remove, get } from "./firebase.js";

const terminal = document.getElementById("chatBox");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");
const themeSelector = document.getElementById("themeSelector");
const neofetch = document.getElementById("neofetch");

const username = localStorage.getItem("shadowfaxUser");
const room = localStorage.getItem("shadowfaxRoom");
const admin = localStorage.getItem("shadowfaxAdmin") === "true";

if(!username || !room){
alert("Select a room first");
window.location = "dashboard.html";
}

/* Timestamp */
function ts(){
const d = new Date();
return `[${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}]`;
}

/* Terminal output */
function log(text){
terminal.innerHTML += text + "<br>";
terminal.scrollTop = terminal.scrollHeight;
}

/* Register user */
set(ref(db,"rooms/"+room+"/users/"+username),true);

/* Join message */
push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:username+" joined"
});

/* Listen for messages */
onChildAdded(ref(db,"rooms/"+room+"/messages"),data=>{

const m = data.val();

let color="green";
if(m.user==="system") color="red";
else if(m.user==="Admin") color="cyan";

const formatted = m.text.replace(/\n/g,"<br>");

log(`<span style="color:${color}">${ts()} ${m.user}:</span> ${formatted}`);

});

/* Send message */
function send(){

if(!msg) return;

const text = msg.value.trim();
if(!text) return;

/* Admin commands */
if(admin && text.startsWith("/broadcast ")){

push(ref(db,"rooms/"+room+"/messages"),{
user:"Admin",
text:text.replace("/broadcast ","")
});

}

else if(admin && text.startsWith("/kick ")){

const target = text.replace("/kick ","");

remove(ref(db,"rooms/"+room+"/users/"+target));

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:target+" was kicked"
});

}

/* List users */
else if(text === "/users"){

get(ref(db,"rooms/"+room+"/users")).then(snap=>{

const users = snap.val();
let list="";

for(const u in users) list += u+" ";

log(`<span style="color:yellow">${ts()} Users:</span> ${list}`);

});

}

/* Neofetch */
else if(text === "/neofetch"){

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

/* Normal message */
else{

push(ref(db,"rooms/"+room+"/messages"),{
user:username,
text:text
});

}

msg.value="";
}

/* Send button */
if(sendBtn) sendBtn.onclick = send;

/* Enter / Shift+Enter handling */
if(msg){
msg.addEventListener("keydown",function(e){

if(e.key==="Enter" && !e.shiftKey){
e.preventDefault();
send();
}

});
}

/* Clear chat */
window.clearChat = function(){
terminal.innerHTML="";
};

/* Theme switcher */
if(themeSelector){
themeSelector.onchange=function(){

localStorage.setItem("shadowfaxTheme",this.value);
applyTheme(this.value);

};
}

function applyTheme(t){

if(t==="green") document.body.style.color="#00ff00";
if(t==="blue") document.body.style.color="#00aaff";
if(t==="white") document.body.style.color="#ffffff";

}

applyTheme(localStorage.getItem("shadowfaxTheme") || "green");
