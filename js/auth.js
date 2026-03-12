const ADMIN_PASS = "Eru_Iluvatar_031206";
const FRIEND_PASS = "Friend123";

function login(){

let username = document.getElementById("username").value.trim();
let password = document.getElementById("password").value.trim();

const regex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;

let isAdmin = false;

/* empty check */

if(username === "" || password === ""){

alert("Enter username and password");

return;

}

/* ADMIN LOGIN */

if(username === "Admin" && password === ADMIN_PASS){

isAdmin = true;

}

/* USER LOGIN */

else if(regex.test(username) && password === FRIEND_PASS){

isAdmin = false;

}

/* INVALID */

else{

alert("Invalid login");

return;

}

/* SAVE SESSION */

localStorage.setItem("shadowfaxUser", username);
localStorage.setItem("shadowfaxAdmin", isAdmin);
localStorage.setItem("shadowfaxSession", "session-" + Date.now());

/* REDIRECT */

window.location = "dashboard.html";

}

/* ENTER KEY SUPPORT */

document.addEventListener("keypress",function(e){

if(e.key === "Enter"){
login();
}

});
