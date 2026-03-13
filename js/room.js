import { db, ref, push, onChildAdded, set, remove, get, onDisconnect } from "./firebase.js";

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
    window.location="dashboard.html";
}

/* Timestamp */
function ts(){
    const d = new Date();
    return `[${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}]`;
}

/* Terminal output */
function log(text){
    terminal.innerHTML += text+"<br>";
    terminal.scrollTop = terminal.scrollHeight;
}

/* USER PRESENCE */
const userRef = ref(db, "rooms/" + room + "/users/" + username);
set(userRef, true);

/* JOIN MESSAGE */
push(ref(db, "rooms/" + room + "/messages"), {
    user: "system",
    text: username + " joined"
});

/* REMOVE USER ON DISCONNECT */
onDisconnect(userRef).remove();

/* SEND LEAVE MESSAGE ON DISCONNECT */
const leaveMsgRef = push(ref(db, "rooms/" + room + "/messages"));
onDisconnect(leaveMsgRef).set({
    user: "system",
    text: username + " left"
});

/* REMOVE USER IF TAB CLOSED */
window.addEventListener("beforeunload", () => {
    remove(userRef);
});

/* MESSAGE LISTENER */
onChildAdded(ref(db, "rooms/" + room + "/messages"), data => {

    const m = data.val();
    let color = "#00ff00";

    if(m.user === "system") color = "#ff4444";
    else if(m.user === "Admin") color = "#00aaff";

    const formatted = m.text.replace(/\n/g, "<br>");

    log(`<span style="color:${color}">${ts()} ${m.user}:</span> ${formatted}`);
});

/* SEND MESSAGE */
function send(){

    const text = msg.value.trim();
    if(!text) return;

    /* ADMIN COMMANDS */

    /* CLEAR CHAT */
    if(admin && text === "/clear"){

        remove(ref(db, "rooms/" + room + "/messages"));

        terminal.innerHTML = "";

        push(ref(db, "rooms/" + room + "/messages"), {
            user: "system",
            text: "Admin cleared the chat"
        });

    }

    /* BROADCAST */
    else if(admin && text.startsWith("/broadcast ")){

        push(ref(db, "rooms/" + room + "/messages"), {
            user: "Admin",
            text: text.replace("/broadcast ", "")
        });

    }

    /* KICK USER */
    else if(admin && text.startsWith("/kick ")){

        const target = text.replace("/kick ", "");

        if(target){

            remove(ref(db, "rooms/" + room + "/users/" + target));

            push(ref(db, "rooms/" + room + "/messages"), {
                user: "system",
                text: target + " was kicked"
            });

        }

    }

    /* LIST USERS */
    else if(text === "/users"){

        get(ref(db, "rooms/" + room + "/users")).then(snap => {

            const users = snap.val();
            let list = "";

            for(const u in users) list += u + " ";

            log(`<span style="color:yellow">${ts()} Users:</span> ${list}`);

        });

    }

    /* NEOFETCH */
    else if(text === "/neofetch"){

        neofetch.innerHTML = `<pre>
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

        push(ref(db, "rooms/" + room + "/messages"), {
            user: username,
            text: text
        });

    }

    msg.value = "";
}

/* UI EVENT HANDLERS */

sendBtn.onclick = send;

msg.addEventListener("keydown", function(e){

    if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        send();
    }

});

/* CLEAR CHAT BUTTON (LOCAL ONLY) */
window.clearChat = function(){
    terminal.innerHTML = "";
};

/* THEMES */

themeSelector.onchange = function(){

    localStorage.setItem("shadowfaxTheme", this.value);
    applyTheme(this.value);

};

function applyTheme(t){

    if(t === "green") document.body.style.color = "#00ff00";
    if(t === "blue") document.body.style.color = "#00aaff";
    if(t === "white") document.body.style.color = "#ffffff";

}

applyTheme(localStorage.getItem("shadowfaxTheme") || "green");
