const USERNAME = window.localStorage.getItem('username');

const display = document.getElementById('display');
const personal = document.getElementById('personal');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const pass = document.getElementById('password');
const saveBtn = document.getElementById('save');
const delBtn = document.getElementById('delete_user');

// Event Listeners
display.addEventListener('click', () => {
    window.location = "/profile-settings-profile-display.html";
});
personal.addEventListener('click', () => {
    window.location = "/profile-settings-personal-info.html";
});
feed.addEventListener('click', () => {
    window.location = "/main-feed.html";
});

saveBtn.addEventListener('click', async () => {
    if (pass.value === '') {
        window.alert('Your password cannot be empty');
    } else {
        await fetch('/user/updatePass', {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "username=" + USERNAME + "&password=" + pass.value
        }).catch(function (error) {
            console.log('Request failed', error);
        });
        window.alert('Changes successfully saved.');
    }
});
delBtn.addEventListener('click', async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone!')) {
        await fetch('/user/delete', {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "username=" + USERNAME
        })
            .catch(function (error) {
                console.log('Request failed', error);
            });
    }
    window.location = "/";
    window.localStorage.setItem('username', '');
});