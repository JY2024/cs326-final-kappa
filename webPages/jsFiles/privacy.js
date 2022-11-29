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
    // name
    if (display_name.checked) {
        fetch('/user/update', { 
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "name=Anonymous" + "&username=" + USERNAME
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    }
    // description
    if (description.checked) {
        fetch('/user/update', { 
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "description=This user has chosen to hide their description." + "&username=" + USERNAME
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    }
    // recipe hiding
    if (recipes.checked) {
        fetch('/user/update', { 
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "recipe_hide=true" + "&username=" + USERNAME
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
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