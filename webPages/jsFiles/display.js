import { fixURL } from "./utility.js";
const USERNAME = 'Jay'; // DO LATER

const personal = document.getElementById('personal');
const security = document.getElementById('security');
const privacy = document.getElementById('privacy');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const display_name = document.getElementById('name');
const pic = document.getElementById('pic');
const desc = document.getElementById('text-area');
const saveBtn = document.getElementById('save');

async function loadData() {
    const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        display_name.setAttribute('placeholder', json.display_name);
        desc.setAttribute('placeholder', json.description);
        renderPic(json.profile_pic);
    }
}

function renderPic() {
    // DO LATER
}

function saveChanges() {
    // display name
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

    // description
    fetch('/user/update', { 
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "description=" + description.value + "&username=" + USERNAME
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

personal.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
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

saveBtn.addEventListener('click', saveChanges);

window.onload = loadData;