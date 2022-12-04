import { fixURL } from "./utility.js";
const USERNAME = window.localStorage.username;
let curRecipe = null; // the id of the current recipe

async function renderRecipe() {
    const request = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=0&username=' + USERNAME, {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        curRecipe = json.recipe_id;
        // PICTURE
        // document.getElementById('picture').setAttribute('src', json.recipe_picture);
        // HEADER INFO
        document.getElementById('recipe_name').innerHTML = json.recipe_name;
        document.getElementById('creator').innerHTML = json.author;
        document.getElementById('creator_bottom').innerHTML = json.author;
        renderPreferences(document.getElementById('preferences'), json.preferences);
        renderTime(document.getElementById('time'), json.prep_time)

        // INGREDIENTS
        const ingredList = document.getElementById('ingredients');
        renderIngredients(ingredList, json.ingredients);
        
        // INSTRUCTIONS
        const instructionsHolder = document.getElementById('instructions');
        renderInstructions(instructionsHolder, json.instructions);

        // TIPS AND NOTES
        renderTips(document.getElementById('tips_and_notes'), json.tips_and_notes);
    }
}
function renderTips(tipsElement, tips) {
    tips = tips.split('\\n');
    for (let i = 0; i < tips.length; i++) {
        tipsElement.appendChild(document.createTextNode(tips[i]));
        tipsElement.appendChild(document.createElement('br'));
    }
}
function renderTime(timeElement, prepTime) {
    const times = ['Less than 30 min', 'Approx 30 min', '30 to 90 min', 'Approx 90 min', '90 to 120 min', 'Approx 120 min', 'More than 120 min'];
    timeElement.appendChild(document.createTextNode('  ' + times[prepTime]));
}
function renderInstructions(instructList, instructions) {
    instructions = instructions.split('\\n');
    for (let i = 0; i < instructions.length; i++) {
        const listItem = document.createElement('li');
        listItem.appendChild(document.createTextNode(instructions[i]));
        instructList.appendChild(listItem);
    }
}
function renderIngredients(ingredList, ingredients) {
    ingredients = JSON.parse(ingredients);
    for (const ingred of Object.keys(ingredients)) {
        const listItem = document.createElement('li');
        const amt = document.createElement('small');
        amt.appendChild(document.createTextNode(ingredients[ingred]));
        listItem.appendChild(document.createTextNode(ingred + '  '));
        listItem.appendChild(amt);
        ingredList.appendChild(listItem);
    }
}
function renderPreferences(element, prefArr) {
    const preferencesNames = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Pescetarian', 'Keto', 'Low Carb', 'High Protein', 'No Shellfish', 'No Nuts', 'No Soy', 'Sugar Free'];
    // <span class="badge rounded-pill text-bg-primary">Dairy Free</span> <span class="badge rounded-pill text-bg-danger">Spice</span> <span class="badge rounded-pill text-bg-success">Vegan</span>
    for (let i = 0; i < 12; i++) {
        if (parseInt(prefArr[i])) {
            const span = document.createElement('span');
            span.classList.add('badge');
            span.classList.add('rounded-pill');
            span.classList.add('text-bg-primary');
            span.innerText = preferencesNames[i];
            element.appendChild(span); 
        }
    }
}

function addLikeByUser() {
    fetch('/recipe/like/new', { 
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "username=" + USERNAME + "&recipe_id=" + curRecipe
     })
    .then(function (data) {
        alert("Recipe " + recipe_id + " successfully liked\n");
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
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

// EVENT LISTENERS
const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
noBtn.addEventListener('click', () => {
    // clear everything
    document.getElementById('time').innerHTML = '';
    document.getElementById('ingredients').innerHTML = '';
    document.getElementById('instructions').innerHTML = '';
    document.getElementById('tips_and_notes').innerHTML = '';
    document.getElementById('preferences').innerHTML = '';
    renderRecipe();
});
yesBtn.addEventListener('click', () => {
    addLikeByUser();
    window.localStorage.setItem('cur_recipe_id', JSON.stringify(curRecipe));
    window.location = "/recipe.html";
});

window.onload = renderRecipe;