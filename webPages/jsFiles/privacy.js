import { fixURL } from "./utility.js";

const display = document.getElementById('display');
const security = document.getElementById('security');
const personal = document.getElementById('personal');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const display_name = document.getElementById('name');
const description = document.getElementById('desc');
const recipes = document.getElementById('recipes');
const saveBtn = document.getElementById('save');

async function loadData() {
    const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        display_name.checked = json.display_name !== 'Anonymous';
        description.checked = json.description !== 'This user has chosen to hide their description.';
        recipes.checked = json.hide_recipes;
    }
}

function saveChanges() {
    const requests = [];
    const arr = [display_name, description, recipes];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
            let query = '/user/update?';
            switch(i) {
                case 0: query += 'name=Anonymous'; break;
                case 1: query += 'description=This user has chosen to hide their description.'; break;
                case 3: query += 'recipe_hide=true'; break;
            }
            requests.push(new Request(fixURL(window.location.href) + query + '&username=' + USERNAME, {method: 'POST'}));
        } else {
            requests.push(-1);
        }
    }
    for (const req of requests) {
        (async () => {
            return await fetch(req);
        })();
    }
}

// NAVIGATION
display.addEventListener('click', () =>{
    window.location = "/profile-settings-profile-display.html";
});
security.addEventListener('click', () =>{
    window.location = "/profile-settings-security.html";
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

// EVENT LISTENERS
saveBtn.addEventListener('click', saveChanges);

window.onload = loadData;