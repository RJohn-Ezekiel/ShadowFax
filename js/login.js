const ADMIN_PASS="Eru_Iluvatar_031206";
const FRIEND_PASS="Friend123";

window.login=function(){

let username=document.getElementById("username").value;
let pass=document.getElementById("password").value;

const regex=/^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;

let isAdmin=false;

if(username==="Admin" && pass===ADMIN_PASS){
isAdmin=true;
}
else if(regex.test(username) && pass===FRIEND_PASS){
isAdmin=false;
}
else{
alert("Invalid login");
return;
}

localStorage.setItem("shadowfaxUser",username);
localStorage.setItem("shadowfaxAdmin",isAdmin);

window.location="dashboard.html";

}
