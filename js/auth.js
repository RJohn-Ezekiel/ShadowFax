import { db } from "./firebase.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

function validUser(name){

if(!/^[a-zA-Z0-9]+$/.test(name)){
alert("username must be alphanumeric");
return false;
}

if(/^[a-zA-Z]+$/.test(name)){
alert("cannot be only letters");
return false;
}

if(/^[0-9]+$/.test(name)){
alert("cannot be only numbers");
return false;
}

return true;
}

window.signup=function(){

let u=username.value;
let p=password.value;

if(!validUser(u)) return;

set(ref(db,"users/"+u),{password:p});

alert("account created");

}

window.login=function(){

let u=username.value;
let p=password.value;

get(ref(db,"users/"+u)).then(snap=>{

let data=snap.val();

if(!data){
alert("user not found");
return;
}

if(data.password!==p){
alert("wrong password");
return;
}

localStorage.setItem("shadowfaxUser",u);

window.location="dashboard.html";

});

}
