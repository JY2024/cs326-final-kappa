const display = document.getElementById('display');
const security = document.getElementById('security');
const personal = document.getElementById('personal');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');

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