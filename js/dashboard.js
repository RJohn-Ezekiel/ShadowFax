// dashboard.js
import { db } from "./firebase.js";
import { ref, set, onChildAdded, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const roomList = document.getElementById("roomList");
const adminPanel = document.getElementById("adminPanel");
const userLabel = document.getElementById("userLabel");
const themeSelector = document.getElementById("themeSelector");

const username = localStorage.getItem("shadowfaxUser");
const admin = localStorage.getItem("shadowfaxAdmin")==="true";

userLabel.innerText = username;

if(!admin){
    adminPanel.style.display="none";
}

// Load rooms
onChildAdded(ref(db,"rooms"),data=>{
    let r = data.key;
    const div = document.createElement("div");
    div.className="roomItem";
    div.innerHTML = `<span>${r}</span> <button onclick="joinRoom('${r}')">JOIN</button>`;
    roomList.appendChild(div);
});

window.joinRoom = function(r){
    let pass = prompt("Enter room password:");
    get(ref(db,"rooms/"+r+"/pass")).then(snapshot=>{
        if(snapshot.val()===pass){
            localStorage.setItem("shadowfaxRoom",r);
            window.location="room.html";
        } else {
            alert("Wrong room password!");
        }
    });
}

// Admin create room
if(admin){
    document.getElementById("createRoomBtn").onclick=function(){
        let r=roomname.value.trim();
        let p=roompass.value.trim();
        if(!r || !p){ alert("Enter room name & password"); return; }
        set(ref(db,"rooms/"+r),{pass:p});
        localStorage.setItem("shadowfaxRoom",r);
        window.location="room.html";
    }
}

// Theme selector
themeSelector.onchange = function(){
    localStorage.setItem("shadowfaxTheme",this.value);
    applyTheme(this.value);
}

function applyTheme(t){
    if(t==="green") document.body.style.color="#00ff00";
    if(t==="blue") document.body.style.color="#00aaff";
    if(t==="white") document.body.style.color="#ffffff";
}
applyTheme(localStorage.getItem("shadowfaxTheme") || "green");
