import { fixURL } from "./utility.js";
const USERNAME = window.localStorage.getItem('username');

const display = document.getElementById('display');
const security = document.getElementById('security');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const saveBtn = document.getElementById('save');
const location = document.getElementById('location');
const checkBoxes = document.getElementsByClassName('form-check-input');

async function loadData() {
    const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, { method: 'GET' });
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        location.value = json.location;
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
        body: "username=" + USERNAME + "&profile_picture=same&location=" + location.value + '&preferences=' + user_pref + '&description=same&hide_recipes=same&display_name=same'
    }).catch(function (error) {
        console.log('Request failed', error);
    });
}


window.onload = loadData;

// NAVIGATION
display.addEventListener('click', () => {
    window.location = "/profile-settings-profile-display.html";
});
security.addEventListener('click', () => {
    window.location = "/profile-settings-security.html";
});
profile.addEventListener('click', () => {
    window.location = "/profile.html";
});
feed.addEventListener('click', () => {
    window.location = "/main-feed.html";
});

// EVENT LISTENERS
saveBtn.addEventListener('click', () => {
    saveChanges();
    window.alert('Changes successfully saved.');
});