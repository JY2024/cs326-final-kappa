function fixURL(url) {
    return url.substring(0, url.lastIndexOf('/'));
}
async function renderRecipe() {    
    const request = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=0', {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        // RENDER PICTURE (DO LATER)
        // HEADER INFO
        document.getElementById('recipe_name').innerHTML = json.recipe_name;
        document.getElementById('creator').innerHTML = json.author;
        document.getElementById('creator_bottom').innerHTML = json.author;
        const prefList = document.getElementById('preferences');
        renderPreferences(prefList, json.preferences);
        document.getElementById('time').innerHTML = ' ' + json.time;
        // RATINGS
        const heart = document.createElement('i');
        heart.classList.add('bi');
        heart.classList.add('bi-heart-fill');
        element.appendChild(heart);
        const num = document.createTextNode(json.num_likes);
        document.getElementById('ratings').appendChild(heart);
        document.getElementById('ratings').appendChild(num);

        // INGREDIENTS
        const ingredList = document.getElementById('ingredients');
        const listHolder = document.createElement('div');
        for (const ingred of json.ingredients) {
            const ingredName = Object.keys(ingred)[0];
            const amount = ingred[ingredName];
            const listElement = document.createElement('li');
            const smallElement = document.createElement('small');
            smallElement.appendChild(document.createTextNode(amount));
            listElement.appendChild(document.createTextNode(ingredName + ' '));
            listElement.appendChild(smallElement);
            listHolder.appendChild(listElement);
        }
        ingredList.appendChild(listHolder);
        
        // INSTRUCTIONS
        const instructionsHolder = document.getElementById('instructions');
        for (let i = 1; i <= json.instructions.length; i++) {
            instructionsHolder.appendChild(document.createTextNode(i + '. ' + json.instructions[i - 1]));
            instructionsHolder.appendChild(document.createElement('br'));
        }

        // TIPS AND NOTES
        const tipsSection = document.getElementById('tips_and_notes');
        tipsSection.innerHTML = json.tips_and_notes;
    }
}
function renderPreferences(element, prefArr) {
    const preferencesNames = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Pescetarian', 'Keto', 'Low Carb', 'High Protein', 'No Shellfish', 'No Nuts', 'No Soy', 'Sugar Free'];
    // <span class="badge rounded-pill text-bg-primary">Dairy Free</span> <span class="badge rounded-pill text-bg-danger">Spice</span> <span class="badge rounded-pill text-bg-success">Vegan</span>
    for (let i = 0; i < 12; i++) {
        if (prefArr[i]) {
            const span = document.createElement('span');
            span.classList.add('badge');
            span.classList.add('rounded-pill');
            span.classList.add('text-bg-primary');
            span.innerText = preferencesNames[i];
            element.appendChild(span); 
        }
    }
}

// NAVIGATION
const settings = document.getElementById('settings');
const profile = document.getElementById('profile');
profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
settings.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});
const choice = document.getElementById('yes');
choice.addEventListener('click', async () => { 
    console.log(fixURL(window.location.href) + '/recipe/view?recipeID=' + 1987);
    const request = new Request(fixURL(window.location.href) + '/recipe/view?recipeID=' + 1987 , {method: 'POST'});
    const response = await fetch(request);
    if (response.ok){
        window.location = "/recipe.html";
    }
    console.log('Completed!', response);
});

window.onload = renderRecipe;