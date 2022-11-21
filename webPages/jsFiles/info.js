import { fixURL } from "./utility.js";
const USERNAME = 'Jay'; // DO LATER

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
    // name and location
    const requests = [];
    requests.push(new Request(fixURL(window.location.href) + '/user/update?name=' + display_name.value + '&username=' + USERNAME, {method: 'POST'}));
    requests.push(new Request(fixURL(window.location.href) + '/user/update?location=' + location.value + '&username=' + USERNAME, {method: 'POST'}));
    for (const req of requests) {
        const res1 = (async () => {
            return await fetch(req);
        })();
    }
    // preferences
    const user_pref = [];
    const prefs = Array.from(checkBoxes);
    for (const pref of prefs) {
        user_pref.push(pref.checked ? 1 : 0);
    }
    const req3 = new Request(fixURL(window.location.href) + '/user/update/preferences?username=' + USERNAME, {method: 'POST'});
    req3.body = user_pref;
    (async () => {
        return await fetch(req3);
    })();
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