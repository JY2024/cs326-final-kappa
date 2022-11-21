const profile = document.getElementById('profile');
const settings = document.getElementById('settings');
const chat = document.getElementById('messages');
let currUser = '';

profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
settings.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});
// chat.addEventListener('click', () =>{
//     window.location = "/chat.html";
// });
function fixURL(url) {
    return url.substring(0, url.lastIndexOf('/'));
}

chat.addEventListener('click', async () => { 
    const request = new Request(fixURL(window.location.href) + '/chat/new?sender=' + "test" + '&reciever=' + currUser , {method: 'POST'});
    const response = await fetch(request);
    if (response.ok){
        window.location = "/chat.html";
    }
    console.log('Completed!', response);
});

async function renderRecipe() {
    // return {recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "filename.jpeg", ingredients: [{"dough": "3 pounds"}, {"sauce": "2 gallons"}, {"cheese" : "3 cups"}], instruction: ["knead dough", "spread sauce", "sprinkle cheese"], preferences: [0,1,0,0,0,0,0], time: "approx 90 minutes", likes:2, rating: 3.4, "ingredients_notes":"Feel free to experiment with toppings!"};
    console.log(window.location.href);
    console.log(fixURL(window.location.href));
    const request = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=' + 1987 , {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
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

        // CREATOR
        const creator = document.getElementById('creator');
        creator.innerText = "Created By: " + json.recipe_author;
        currUser = json.recipe_author;
    }
    //COMMENTS
    const comments = document.getElementById('comment');
    const req = new Request(fixURL(window.location.href) + '/comment/read?comment_id=' + 1987 , {method: 'GET'});
    const res = await fetch(req);
    if(res.ok){
        const json = await res.json();
        comments.innerText = json.text;
    }
}
window.onload = renderRecipe;