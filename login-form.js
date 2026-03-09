const form = document.getElementById("login-form");

form.addEventListener("submit", function(e){

e.preventDefault();

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value.trim();

if(username === "admin" && password === "admin123"){

localStorage.setItem("isLoggedIn","true");

alert("Login successful");

window.location.href = "index.html";

}else{

alert("Invalid username or password");

}

});