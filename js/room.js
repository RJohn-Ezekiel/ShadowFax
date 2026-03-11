import { db } from "./firebase.js";
import { ref, push, onChildAdded, set, remove, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// Retrieve user info
let username = localStorage.getItem("shadowfaxUser");
let room = localStorage.getItem("shadowfaxRoom");
let admin = localStorage.getItem("shadowfaxAdmin") === "true";

// Terminal container
const terminal = document.getElementById("terminal");

// Timestamp function
function ts() {
    let d = new Date();
    return `[${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}]`;
}

// Log to terminal
function log(text, color = "#c0c0c0") {
    const span = document.createElement("span");
    span.style.color = color;
    span.innerHTML = text;
    terminal.appendChild(span);
    terminal.appendChild(document.createElement("br"));
    terminal.scrollTop = terminal.scrollHeight;
}

// Add user to room
set(ref(db, "rooms/" + room + "/users/" + username), true);

// Notify system that user joined
push(ref(db, "rooms/" + room + "/messages"), {
    user: "system",
    text: username + " joined"
});

// Listen for messages
onChildAdded(ref(db, "rooms/" + room + "/messages"), data => {
    const m = data.val();

    let color = "#c0c0c0"; // default
    if (m.user === "system") color = "#800080";      // purple
    else if (m.user === "BROADCAST") color = "#ff0000"; // red
    else if (m.user === "WARNING") color = "#ffff00"; // yellow

    log(`${ts()} ${m.user}: ${m.text}`, color);
});

// Send on Enter key
document.getElementById("msg").addEventListener("keypress", function(e) {
    if (e.key === "Enter") send();
});

function send() {
    const text = msg.value.trim();
    if (!text) return;

    // Admin Commands
    if (admin) {
        if (text.startsWith("/broadcast ")) {
            let msgText = text.replace("/broadcast ", "");
            push(ref(db, "rooms/" + room + "/messages"), {
                user: "BROADCAST",
                text: msgText
            });
        }
        else if (text.startsWith("/warning ")) {
            let msgText = text.replace("/warning ", "");
            push(ref(db, "rooms/" + room + "/messages"), {
                user: "WARNING",
                text: msgText
            });
        }
        else if (text.startsWith("/kick ")) {
            let target = text.replace("/kick ", "");
            remove(ref(db, "rooms/" + room + "/users/" + target));
            push(ref(db, "rooms/" + room + "/messages"), {
                user: "system",
                text: target + " was kicked by admin"
            });
        }
        else if (text === "/clearchat") {
            remove(ref(db, "rooms/" + room + "/messages"));
            push(ref(db, "rooms/" + room + "/messages"), {
                user: "system",
                text: "Chat cleared by admin"
            });
        }
        else if (text === "/users") {
            get(ref(db, "rooms/" + room + "/users")).then(snap => {
                const users = snap.val() || {};
                log("Users in room:", "#00ff00");
                for (let u in users) {
                    log(`-rw-r--r-- 1 user shadowfax ${u}`, "#00ff00");
                }
            });
        }
    }

    // Non-command messages
    if (text === "/neofetch") {
        log(`
███████╗
██╔════╝
███████╗   ShadowFax
╚════██║   ----------
███████║   User: ${username}
╚══════╝   Room: ${room}
            Backend: Firebase
            Admin: ${admin}
`, "#00ff00");
    } 
    else if (!text.startsWith("/")) {
        push(ref(db, "rooms/" + room + "/messages"), {
            user: username,
            text: text
        });
    }

    msg.value = "";
}
