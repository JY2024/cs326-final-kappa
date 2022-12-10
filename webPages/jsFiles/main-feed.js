import { fixURL } from "./utility.js";
import { resources } from './pic-resources.js';
const USERNAME = window.localStorage.getItem('username');
let curRecipe = null, nextRecipe = null;

// Initializes the next recipe
async function init() {
    const req = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=0&username=' + USERNAME, { method: 'GET' });
    const res = await fetch(req);
    if (res.ok) {
        const json = await res.json();
        if (json.error === 'no more recipes') {
            window.location = "/uhoh.html";
        } else {
            nextRecipe = json.recipe_id;
            await renderRecipe();
        }
    }
}

// Renders two pictures of recipes and info of the current recipe
async function renderRecipe() {
    // load next recipe
    if (nextRecipe === null) {
        window.location = "/uhoh.html";
    } else {
        const request1 = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=' + nextRecipe + '&username=' + USERNAME, { method: 'GET' });
        const response1 = await fetch(request1);
        if (response1.ok) {
            const json1 = await response1.json();
            curRecipe = json1.recipe_id;
            // PICTURES
            document.getElementById('picture').setAttribute('src', json1.recipe_picture);
            // HEADER INFO
            document.getElementById('recipe_name').innerHTML = json1.recipe_name;
            document.getElementById('creator').innerHTML = json1.author;
            document.getElementById('creator_bottom').innerHTML = json1.author;
            renderPreferences(document.getElementById('preferences'), json1.preferences);
            renderTime(document.getElementById('time'), json1.prep_time)
            // INGREDIENTS
            const ingredList = document.getElementById('ingredients');
            renderIngredients(ingredList, json1.ingredients);
            // INSTRUCTIONS
            const instructionsHolder = document.getElementById('instructions');
            renderInstructions(instructionsHolder, json1.instructions);
            // TIPS AND NOTES
            renderTips(document.getElementById('tips_and_notes'), json1.tips_and_notes);
        }
    }

    // load new next recipe
    const request2 = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=0&username=' + USERNAME, { method: 'GET' });
    const response2 = await fetch(request2);
    if (response2.ok) {
        let json2 = await response2.json();
        if (json2.length === 1) {
            document.getElementById('next_pic').setAttribute('src', resources[0].uhoh);
            nextRecipe = null;
        } else {
            while (json2.recipe_id === curRecipe) {
                const req = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=0&username=' + USERNAME, { method: 'GET' });
                const res = await fetch(req);
                if (res.ok) {
                    json2 = await res.json();
                }
            }
            nextRecipe = json2.recipe_id;
            document.getElementById('next_pic').setAttribute('src', json2.recipe_picture);
        }
    }
}
//renderTips(tipsElement: DOM element, tips: string): void
function renderTips(tipsElement, tips) {
    tips = tips.split('\\n');
    for (let i = 0; i < tips.length; i++) {
        tipsElement.appendChild(document.createTextNode(tips[i]));
        tipsElement.appendChild(document.createElement('br'));
    }
}
//renderTime(timeElement: DOM element, prepTime: string): void
function renderTime(timeElement, prepTime) {
    const times = ['Less than 30 min', 'Approx 30 min', '30 to 90 min', 'Approx 90 min', '90 to 120 min', 'Approx 120 min', 'More than 120 min'];
    timeElement.appendChild(document.createTextNode('  ' + times[prepTime]));
}
//renderInstructions(instructList: DOM element, instructions: string): void
function renderInstructions(instructList, instructions) {
    instructions = instructions.split('\\n');
    for (let i = 0; i < instructions.length; i++) {
        const listItem = document.createElement('li');
        listItem.appendChild(document.createTextNode(instructions[i]));
        instructList.appendChild(listItem);
    }
}
//renderIngredients(ingredList: DOM element, ingredients: )
function renderIngredients(ingredList, ingredients) {
    let temp = ingredients.split('\\n');
    for (const ingred of temp) {
        const listItem = document.createElement('li');
        listItem.appendChild(document.createTextNode(ingred));
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


window.onload = init;