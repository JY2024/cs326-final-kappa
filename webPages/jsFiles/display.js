import { fixURL } from "./utility.js";
const USERNAME = window.localStorage.getItem('username');

const personal = document.getElementById('personal');
const security = document.getElementById('security');
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
        display_name.value = json.display_name;
        desc.innerText= json.description;
        renderPic(json.profile_pic);
    }
}

function renderPic() {
    // DO LATER
}

function saveChanges() {
    fetch('/user/update', {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'username=' + USERNAME + '&profile_picture=' + 'dummy-pic-string' + '&location=same&preferences=same&description=' + desc.value + '&hide_recipes=same&display_name=' + display_name.value
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

window.onload = loadData;