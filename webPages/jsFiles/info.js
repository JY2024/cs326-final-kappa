import { fixURL } from "./utility.js";
const USERNAME = window.localStorage.getItem('username');

const display = document.getElementById('display');
const security = document.getElementById('security');
const privacy = document.getElementById('privacy');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const saveBtn = document.getElementById('save');
const display_name = document.getElementById('name');
const location = document.getElementById('location');
const checkBoxes = document.getElementsByClassName('form-check-input');

async function loadData() {
    const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        display_name.setAttribute('placeholder', json.display_name);
        location.setAttribute('placeholder', json.location);
        renderPreferences(json.preferences);
    }
}
function renderPreferences(preferences) {
    const prefArr = Array.from(checkBoxes);
    for (let i = 0; i < preferences.length; i++) {
        if (parseInt(preferences[i])) {
            prefArr[i].checked = true;
        }
    }
}

function saveChanges() {
    // name
    fetch('/user/update', { 
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "name=" + display_name.value + "&username=" + USERNAME
     })
    .catch(function (error) {
        console.log('Request failed', error);
    });

    // location
    fetch('/user/update', { 
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "location=" + location.value + "&username=" + USERNAME
     })
    .catch(function (error) {
        console.log('Request failed', error);
    });
    // preferences
    let user_pref = '';
    const prefs = Array.from(checkBoxes);
    for (const pref of prefs) {
        user_pref += (pref.checked ? '1' : '0');
    }
    fetch('/user/update', { 
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "preferences=" + user_pref + "&username=" + USERNAME
     })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

// NAVIGATION
display.addEventListener('click', () =>{
    window.location = "/profile-settings-profile-display.html";
});
security.addEventListener('click', () =>{
    window.location = "/profile-settings-security.html";
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

// EVENT LISTENERS
saveBtn.addEventListener('click', saveChanges);

window.onload = loadData;