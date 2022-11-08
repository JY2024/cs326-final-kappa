const display = document.getElementById('display');
const personal = document.getElementById('personal');
const privacy = document.getElementById('privacy');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');

display.addEventListener('click', () =>{
    window.location = "/profile-settings-profile-display.html";
});
personal.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
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