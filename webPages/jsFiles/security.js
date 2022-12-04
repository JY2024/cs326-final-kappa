import { fixURL } from "./utility.js";
const USERNAME = window.localStorage.getItem('username');

const display = document.getElementById('display');
const personal = document.getElementById('personal');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const pass = document.getElementById('password');
const saveBtn = document.getElementById('save');
const delBtn = document.getElementById('delete_user');

// async function loadData() {
//     const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, {method: 'GET'});
//     const response = await fetch(request);
//     if (response.ok) {
//         const json = await response.json();
//         pass.setAttribute('placeholder', 'ENTER NEW PASSWORD'); // BUT THERE IS NO PASSWORD FIELD?
//     }
// }

display.addEventListener('click', () =>{
    window.location = "/profile-settings-profile-display.html";
});
personal.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});
profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "/main-feed.html";
});

saveBtn.addEventListener('click', () => {
    fetch('/user/updatePass', {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "username=" + USERNAME + "&password=" + password.value
    }).catch(function (error) {
        console.log('Request failed', error);
    });
    window.alert('Changes successfully saved.');
});
// delBtn.addEventListener('click', () => {
//     fetch('/user/delete', { 
//         mode: 'cors',
//         method: 'POST',
//         headers: {
//             "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
//         },
//         body: "username=" + USERNAME
//     })
//     .catch(function (error) {
//         console.log('Request failed', error);
//     });
// });