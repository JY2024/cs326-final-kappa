const display = document.getElementById('display');
const security = document.getElementById('security');
const privacy = document.getElementById('privacy');
const personal = document.getElementById('personal');
const prof = document.getElementById('profile');
const feed = document.getElementById('feed');

display.addEventListener('click', () =>{
    window.location = "/profile-settings-profile-display.html";
});
security.addEventListener('click', () =>{
    window.location = "/profile-settings-security.html";
});
privacy.addEventListener('click', () =>{
    window.location = "/profile-settings-privacy.html";
});
personal.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});
prof.addEventListener('click', () =>{
    window.location = "/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "/main-feed.html";
});