const USERNAME = 'Jay'; // DO LATER

const display = document.getElementById('display');
const security = document.getElementById('security');
const privacy = document.getElementById('privacy');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');

async function loadData() {
    const request = new Request(fixURL(window.location.href) + '/user/read?username=' + USERNAME, {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        document.getElementById('name').setAttribute('placeholder', json.display_name);
        document.getElementById('location').setAttribute('placeholder', json.location);
        renderPreferences(json.preferences);
    }
}
function renderPreferences(preferences) {
    const preferencesNames = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Pescetarian', 'Keto', 'Low Carb', 'High Protein', 'No Shellfish', 'No Nuts', 'No Soy', 'Sugar Free'];
    const prefArr = document.getElementsByClassName('form-check-input');
    for (const pref of preferences) {
        if (pref) {
            
        }
    }
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

window.onload = loadData;