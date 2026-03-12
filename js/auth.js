const ADMIN_PASS = "Eru_Iluvatar_031206";
const FRIEND_PASS = "Friend123";

window.login = function(){

let username = document.getElementById("username").value.trim();
let password = document.getElementById("password").value.trim();

const regex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;

let isAdmin=false;

if(username==="" || password===""){
alert("Enter username and password");
return;
}

if(username==="Admin" && password===ADMIN_PASS){
isAdmin=true;
}
else if(regex.test(username) && password===FRIEND_PASS){
isAdmin=false;
}
else{
alert("Invalid login");
return;
}

localStorage.setItem("shadowfaxUser",username);
localStorage.setItem("shadowfaxAdmin",isAdmin);
localStorage.setItem("shadowfaxSession","session-"+Date.now());

window.location="dashboard.html";

};

document.addEventListener("keypress",function(e){
if(e.key==="Enter") login();
});
