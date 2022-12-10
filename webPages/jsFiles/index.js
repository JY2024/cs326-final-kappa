document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById('createBtn').addEventListener('click', () => {
    console.log('hey, you just clicked the create button');
    window.location = "/main-feed.html";
});

function login(){
    let user = document.getElementById("email").value;
    localStorage.setItem('username', user);
}