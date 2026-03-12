import { db } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = function(){

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value.trim();

if(!username || !password){
alert("enter username and password");
return;
}

get(ref(db,"users/"+username)).then(snapshot=>{

let data = snapshot.val();

if(!data){
alert("user not found");
return;
}

if(data.password !== password){
alert("wrong password");
return;
}

/* SAVE USER */

localStorage.setItem("shadowfaxUser",username);

/* ADMIN CHECK */

if(username === "Admin" && password === "Eru_Iluvatar_031206"){
localStorage.setItem("shadowfaxAdmin","true");
}else{
localStorage.setItem("shadowfaxAdmin","false");
}

/* GO TO DASHBOARD */

window.location = "dashboard.html";

});

};
