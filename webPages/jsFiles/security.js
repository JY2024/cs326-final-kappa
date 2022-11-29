import { fixURL } from "./utility.js";
const USERNAME = 'Jay'; // DO LATER

const display = document.getElementById('display');
const personal = document.getElementById('personal');
const privacy = document.getElementById('privacy');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const username = document.getElementById('username');
const pass = document.getElementById('password');
const saveBtn = document.getElementById('save');
const delBtn = document.getElementById('delete_user');

async function loadData() {
    const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        username.setAttribute('placeholder', json.username);
        pass.setAttribute('placeholder', 'ENTER NEW PASSWORD'); // BUT THERE IS NO PASSWORD FIELD?
    }
}

function saveChanges() {
    // password
    // fetch('/user/update', { 
    //     mode: 'cors',
    //     method: 'POST',
    //     headers: {
    //         "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //     },
    //     body: "description=" + description.value + "&username=" + USERNAME
    // })
    // .catch(function (error) {
    //     console.log('Request failed', error);
    // });
}

display.addEventListener('click', () =>{
    window.location = "/profile-settings-profile-display.html";
});
personal.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});
privacy.addEventListener('click', () =>{
    window.location = "/profile-settings-privacy.html";
});
profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "/main-feed.html";
});

saveBtn.addEventListener('click', saveChanges);
delBtn.addEventListener('click', () => {
    fetch('/user/delete', { 
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
});

window.onload = loadData;