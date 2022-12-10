// NAVIGATION
const settings = document.getElementById('settings');
const profile = document.getElementById('profile');
profile.addEventListener('click', () => {
    window.location = "/profile.html";
});
settings.addEventListener('click', () => {
    window.location = "/profile-settings-personal-info.html";
});