// auth.js
const ADMIN_PASS = "Eru_Iluvatar_031206";
const FRIEND_PASS = "Friend123";

window.login = function() {
  let username = document.getElementById("username").value.trim();
  let pass = document.getElementById("password").value.trim();

  const regex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;

  if(username==="Admin" && pass===ADMIN_PASS){
    localStorage.setItem("shadowfaxUser","Admin");
    localStorage.setItem("shadowfaxAdmin","true");
    window.location = "dashboard.html";
    return;
  }

  if(!regex.test(username) || pass!==FRIEND_PASS){
    alert("Invalid login. Username must be alphanumeric with letters+numbers, password is Friend123.");
    return;
  }

  localStorage.setItem("shadowfaxUser",username);
  localStorage.setItem("shadowfaxAdmin","false");
  window.location = "dashboard.html";
}
