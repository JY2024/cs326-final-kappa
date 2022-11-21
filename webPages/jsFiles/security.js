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
    const requests = [];
    const arr = [username, pass];
    for (let i = 0; i < arr.length; i++) {
            let query = '/user/update?';
            switch(i) {
                case 0: query += 'username=' + username.value; break;
                case 1: query += 'password=' + pass.value; break;
            }
            requests.push(new Request(fixURL(window.location.href) + query + '&username=' + USERNAME, {method: 'POST'}));
    }
    for (const req of requests) {
        (async () => {
            return await fetch(req);
        })();
    }
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

window.onload = loadData;