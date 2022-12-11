document.getElementById("loginBtn").addEventListener("click", async () => {
    await login();
});
document.getElementById("createBtn").addEventListener("click", async () => {
    await postUser();
    window.localStorage.setItem('username', document.getElementById('newUsername').value); // get current user
    window.location = "/main-feed.html"; // redirect to feed
});
// user tried to login
async function login(){
    const result = await fetch('/login', {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'username=' + document.getElementById('username').value + '&password=' + document.getElementById('password').value
    });
    const res = await result.json();
    if (res === 'Error') {
        window.alert('Your username or password is incorrect. Try again.');
    } else {
        let user = document.getElementById("username").value;
        window.localStorage.setItem('username', user);
        window.location = './main-feed.html';
    }
}
// user tried to create account
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