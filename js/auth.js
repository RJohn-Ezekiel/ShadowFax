window.login = function(){

let u = username.value.trim();
let p = password.value.trim();

get(ref(db,"users/"+u)).then(snap=>{

let data = snap.val();

if(!data){
alert("user not found");
return;
}

if(data.password !== p){
alert("wrong password");
return;
}

/* Save session */

localStorage.setItem("shadowfaxUser",u);

/* ADMIN CHECK */

if(u === "Admin" && p === "Eru_Iluvatar_031206"){
localStorage.setItem("shadowfaxAdmin","true");
}else{
localStorage.setItem("shadowfaxAdmin","false");
}

window.location = "dashboard.html";

});

}
