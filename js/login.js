const ADMIN_PASS = "Eru_Iluvatar_031206";
const FRIEND_PASS = "Friend123";

window.login = function(){

let username = document.getElementById("username").value.trim();
let pass = document.getElementById("password").value.trim();

/* username must contain letters and numbers */

const regex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;

let isAdmin = false;

/* empty check */

if(username === "" || pass === ""){
alert("Enter username and password");
return;
}

/* ADMIN LOGIN */

if(username === "Admin" && pass === ADMIN_PASS){

isAdmin = true;

}

/* FRIEND LOGIN */

else if(regex.test(username) && pass === FRIEND_PASS){

isAdmin = false;

}

/* INVALID LOGIN */

else{

alert("Invalid login credentials");
return;

}

/* STORE SESSION */

localStorage.setItem("shadowfaxUser", username);
localStorage.setItem("shadowfaxAdmin", isAdmin);

/* optional session token */

localStorage.setItem("shadowfaxSession", "session-" + Date.now());

/* redirect */

window.location = "dashboard.html";

};

document.addEventListener("keypress",function(e){

if(e.key === "Enter"){
login();
}

});
