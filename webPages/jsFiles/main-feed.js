function fixURL(url) {
    return url.substring(0, url.lastIndexOf('/'));
}
async function renderRecipe() {
    // return {recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "filename.jpeg", ingredients: [{"dough": "3 pounds"}, {"sauce": "2 gallons"}, {"cheese" : "3 cups"}], instruction: ["knead dough", "spread sauce", "sprinkle cheese"], preferences: [0,1,0,0,0,0,0], time: "approx 90 minutes", likes:2, rating: 3.4, "ingredients_notes":"Feel free to experiment with toppings!"};
    
    const request = new Request(fixURL(window.location.href) + '/recipe/read', {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        console.log('json is ' + json);
        // HEADER INFO
        document.getElementById('recipe_name').innerHTML = json.recipe_name;
        document.getElementById('creator').innerHTML = json.recipe_author;
        document.getElementById('creator_bottom').innerHTML = json.recipe_author;
        const prefList = document.getElementById('preferences');
        renderPreferences(prefList, json.preferences);
        document.getElementById('time').innerHTML = ' ' + json.time;
        renderRatings(document.getElementById('ratings'), json.rating);

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
            // INGREDIENTS NOTES
        document.getElementById('ingredients_notes').innerHTML = json.ingredients_notes;
        
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
    const preferencesNames = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Pescetarian', 'Keto', 'Low Carb', 'High Protein', 'Contains Shellfish', 'Contains Nuts', 'Contains Soy', 'Sugar Free'];
    // <span class="badge rounded-pill text-bg-primary">Dairy Free</span> <span class="badge rounded-pill text-bg-danger">Spice</span> <span class="badge rounded-pill text-bg-success">Vegan</span>
    for (let i = 0; i < 7; i++) {
        const span = document.createElement('span');
        span.classList.add('badge');
        span.classList.add('rounded-pill');
        span.classList.add('text-bg-primary');
        span.innerText = preferencesNames[i];
        element.appendChild(span);
    }
}
function renderRatings(element, rating) {
    //<i class="bi bi-heart-fill"></i><i class="bi bi-heart-fill"></i><i class="bi bi-heart-fill"></i><i
    //class="bi bi-heart-fill"></i><i class="bi bi-heart-half"></i><br>
    const fullHearts = Math.floor(rating);
    for (let i = 0; i < fullHearts; i++) {
        const heart = document.createElement('i');
        heart.classList.add('bi');
        heart.classList.add('bi-heart-fill');
        element.appendChild(heart);
    }
    // const halfHearts = (rating - fullHearts) / 0.5;
    // console.log('half hearts is ' + halfHearts);
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