const personal = document.getElementById('personal');
const security = document.getElementById('security');
const privacy = document.getElementById('privacy');
const profile = document.getElementById('profile');
const feed = document.getElementById('feed');

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