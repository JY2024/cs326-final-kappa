const display = document.getElementById('display');
const security = document.getElementById('security');
const privacy = document.getElementById('privacy');
const personal = document.getElementById('personal');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');

display.addEventListener('click', () =>{
    window.location = "./htmlFiles/profile-settings-profile-display.html";
});
security.addEventListener('click', () =>{
    window.location = "./htmlFiles/profile-settings-security.html";
});
privacy.addEventListener('click', () =>{
    window.location = "./htmlFiles/profile-settings-privacy.html";
});
personal.addEventListener('click', () =>{
    window.location = "./htmlFiles/profile-settings-personal-info.html";
});
profile.addEventListener('click', () =>{
    window.location = "./htmlFiles/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "./htmlFiles/main-feed.html";
});