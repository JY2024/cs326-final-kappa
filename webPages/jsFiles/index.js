document.getElementById("loginBtn").addEventListener("click", login);

function login(){
    let user = document.getElementById("email").value;
    window.localStorage.setItem('username', user);
}
