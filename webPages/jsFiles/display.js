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
    const requests = [];
    const arr = [display_name, pic, desc];
    for (let i = 0; i < arr.length; i++) {
            let query = '/user/update?';
            switch(i) {
                case 0: query += 'name=' + display_name.value; break;
                // case 1: query += 'pic='; break; DO LATER
                case 3: query += 'description=' + desc.value; break;
            }
            requests.push(new Request(fixURL(window.location.href) + query + '&username=' + USERNAME, {method: 'POST'}));
        
    }
    for (const req of requests) {
        (async () => {
            return await fetch(req);
        })();
    }
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