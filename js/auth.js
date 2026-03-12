const loginBtn=document.getElementById("loginBtn");

loginBtn.onclick=function(){

let u=document.getElementById("username").value;
let p=document.getElementById("password").value;

localStorage.setItem("shadowfaxUser",u);

if(u==="Admin"){
localStorage.setItem("shadowfaxAdmin","true");
}else{
localStorage.setItem("shadowfaxAdmin","false");
}

window.location="dashboard.html";

}
