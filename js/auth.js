// auth.js

const ADMIN_PASS = "Eru_Iluvatar_031206";
const FRIEND_PASS = "Friend123";

window.login = function () {

    const username = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    const regex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;

    // Admin login
    if (username === "Admin" && pass === ADMIN_PASS) {
        localStorage.setItem("shadowfaxUser", "Admin");
        localStorage.setItem("shadowfaxAdmin", "true");
        window.location.href = "dashboard.html";
        return;
    }

    // Friend login validation
    if (!regex.test(username) || pass !== FRIEND_PASS) {
        alert("Invalid login. Username must contain letters and numbers. Password is Friend123.");
        return;
    }

    // Friend login success
    localStorage.setItem("shadowfaxUser", username);
    localStorage.setItem("shadowfaxAdmin", "false");
    window.location.href = "dashboard.html";
};
