import { encodeImageAsURL, fixURL } from "./utility.js";
const USERNAME = window.localStorage.getItem('username');
let CURPIC = '';

const personal = document.getElementById('personal');
const security = document.getElementById('security');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const display_name = document.getElementById('name');
const pic = document.getElementById('picture');
const pic_selection = document.getElementById('pic');
const desc = document.getElementById('text-area');
const saveBtn = document.getElementById('save');

async function loadData() {
    const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        display_name.value = json.display_name;
        desc.innerText= json.description;
        pic.setAttribute('src', json.profile_picture.split(' ').join('+'));
        CURPIC = json.profile_picture;
    }
}

async function saveChanges() {
    await fetch('/user/update', {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'username=' + USERNAME + '&profile_picture=' + CURPIC + '&location=same&preferences=same&description=' + desc.value + '&display_name=' + display_name.value
    }).catch(function (error) {
        console.log('Request failed', error);
    });
}

personal.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});
security.addEventListener('click', () =>{
    window.location = "/profile-settings-security.html";
});
profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "/main-feed.html";
});

saveBtn.addEventListener('click', () => {
    saveChanges();
    window.alert('Changes successfully saved.');
});

pic_selection.addEventListener('change', async () => {
    const picString = await encodeImageAsURL(pic_selection);
    if (picString.length > 1000000) {
        window.alert('Image too large.');
    }
    pic.setAttribute('src', picString);
    CURPIC = picString;
});

window.onload = loadData;