import { db } from "./firebase.js";
import { ref, push, onChildAdded, set, remove, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

let username=localStorage.getItem("shadowfaxUser");
let room=localStorage.getItem("shadowfaxRoom");
let admin=(localStorage.getItem("shadowfaxAdmin")==="true");

const terminal=document.getElementById("terminal");

function ts(){

let d=new Date();

return `[${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}]`;

}

function log(text){

terminal.innerHTML+=text+"<br>";
terminal.scrollTop=terminal.scrollHeight;

}

set(ref(db,"rooms/"+room+"/users/"+username),true);

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:username+" joined"
});

onChildAdded(ref(db,"rooms/"+room+"/messages"),data=>{

let m=data.val();

log(`${ts()} ${m.user}: ${m.text}`);

});

document.getElementById("msg").addEventListener("keypress",function(e){

if(e.key==="Enter") send();

});

function send(){

let text=msg.value;

if(text.startsWith("/broadcast ") && admin){

let msg=text.replace("/broadcast ","");

push(ref(db,"rooms/"+room+"/messages"),{
user:"BROADCAST",
text:msg
});

}

else if(text.startsWith("/warning ") && admin){

let msg=text.replace("/warning ","");

push(ref(db,"rooms/"+room+"/messages"),{
user:"WARNING",
text:msg
});

}

else if(text.startsWith("/kick ") && admin){

let target=text.replace("/kick ","");

remove(ref(db,"rooms/"+room+"/users/"+target));

push(ref(db,"rooms/"+room+"/messages"),{
user:"system",
text:target+" was kicked"
});

}

else if(text==="/users"){

get(ref(db,"rooms/"+room+"/users")).then(snap=>{

let users=snap.val();

for(let u in users){

log(`-rw-r--r-- 1 user shadowfax ${u}`);

}

});

}

else if(text==="/neofetch"){

log(`
███████╗
██╔════╝
███████╗   ShadowFax
╚════██║   ----------
███████║   User: ${username}
╚══════╝   Room: ${room}
            Backend: Firebase
            Admin: ${admin}
`);

}

else{

push(ref(db,"rooms/"+room+"/messages"),{
user:username,
text:text
});

}

msg.value="";

}