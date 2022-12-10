document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("createBtn").addEventListener("click", async (event) => {
    await postUser();
    window.localStorage.setItem('username', document.getElementById('newUsername').value);
    window.location = "/main-feed.html";
});
async function postUser() {
    const username = document.getElementById('newUsername').value, password = document.getElementById('newPassword').value, displayName = document.getElementById('newDisplayName').value;
    await fetch('/user/new', {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'username=' + username + '&password=' + password + '&displayName=' + displayName
    }).catch(function (error) {
        console.log('Request failed', error);
    });
}
function login(){
    let user = document.getElementById("email").value;
    window.localStorage.setItem('username', user);
}