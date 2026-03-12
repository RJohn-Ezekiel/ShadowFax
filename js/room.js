// room.js
import { db } from "./firebase.js";
import { ref, push, onChildAdded, set, remove, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const terminal = document.getElementById("chatBox");
const msg = document.getElementById("msg");
const themeSelector = document.getElementById("themeSelector");
const neofetch = document.getElementById("neofetch");

const username = localStorage.getItem("shadowfaxUser");
const room = localStorage.getItem("shadowfaxRoom");
const admin = localStorage.getItem("shadowfaxAdmin")==="true";

if(!username || !room){ alert("Select a room first"); window.location="dashboard.html"; }

function ts(){
    let d = new Date();
    return `[${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}]`;
}

function log(text){
    terminal.innerHTML += text+"<br>";
    terminal.scrollTop = terminal.scrollHeight;
}

// Join user
set(ref(db,"rooms/"+room+"/users/"+username),true);

// System join message
push(ref(db,"rooms/"+room+"/messages"),{user:"system",text:username+" joined"});

// Listen for messages
onChildAdded(ref(db,"rooms/"+room+"/messages"),data=>{
    let m=data.val();
    let color="green";
    if(m.user==="system") color="red";
    else if(m.user==="Admin") color="blue";
    else color="green";

    log(`<span style="color:${color}">${ts()} ${m.user}:</span> ${m.text}`);
});

// Send messages
msg.addEventListener("keypress",function(e){ if(e.key==="Enter") send(); });

window.send=function(){
    let text=msg.value.trim();
    if(!text) return;

    if(admin && text.startsWith("/broadcast ")){
        push(ref(db,"rooms/"+room+"/messages"),{user:"Admin",text:text.replace("/broadcast ","")});
    } else if(admin && text.startsWith("/kick ")){
        let target=text.replace("/kick ","");
        remove(ref(db,"rooms/"+room+"/users/"+target});
        push(ref(db,"rooms/"+room+"/messages"),{user:"system",text:target+" was kicked"});
    } else if(text==="/users"){
        get(ref(db,"rooms/"+room+"/users")).then(snap=>{
            let users = snap.val();
            let list="";
            for(let u in users) list+=u+" ";
            log(`<span style="color:yellow">${ts()} Users:</span> ${list}`);
        });
    } else if(text==="/neofetch"){
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
    } else {
        push(ref(db,"rooms/"+room+"/messages"),{user:username,text:text});
    }

    msg.value="";
}

// Clear chat
window.clearChat=function(){
    terminal.innerHTML="";
}

// Theme
themeSelector.onchange=function(){
    localStorage.setItem("shadowfaxTheme",this.value);
    applyTheme(this.value);
}

function applyTheme(t){
    if(t==="green") document.body.style.color="#00ff00";
    if(t==="blue") document.body.style.color="#00aaff";
    if(t==="white") document.body.style.color="#ffffff";
}
applyTheme(localStorage.getItem("shadowfaxTheme")||"green");
