import { fixURL } from './utility.js';

const chat = document.getElementById('messages');
const prefHolder = document.getElementById('preferences');
const allergenHolder = document.getElementById('allergens');
const picture = document.querySelector('.imcol');
const commentBox = document.getElementById('comments');
let currUser = '';
let currRecipe = '';
let prefArray = ["Vegetarian", "Vegan", "Gluten Free", "Dairy Free", "Pescetarian", "Keto", "Low in Carbs", "High in Protein",
                "Shellfish", "Nuts", "Soy", "Sugar"];

// Event Listeners
chat.addEventListener('click', () =>{
    window.localStorage.setItem('chat-user', currUser);
    window.location = "/chat.html";
});
chat.addEventListener('click', async () => { 
    const request = new Request(fixURL(window.location.href) + '/chat/new?sender=' + "test" + '&reciever=' + currUser , {method: 'POST'});
    const response = await fetch(request);
    if (response.ok){
        window.location = "/chat.html";
    }
});

async function renderRecipe() {
    currRecipe = window.localStorage.getItem('cur_recipe_id');
    const request = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=' + currRecipe , {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        // INGREDIENTS
        const ingredList = document.getElementById('ingredients');
        const listHolder = document.createElement('div');
        let temp = json.ingredients.split('\\n');
        for (const ingred of temp){
            const listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(ingred));
            listHolder.appendChild(listItem);
        }
        ingredList.appendChild(listHolder);
        
        // INSTRUCTIONS
        const instructionsHolder = document.getElementById('instructions');
        let instructions = json.instructions.split('\\n');
        for (let i = 0; i < instructions.length; i++) {
            const listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(instructions[i]));
            instructionsHolder.appendChild(listItem);
        }

        // TIPS AND NOTES
        let tips = json.tips_and_notes.split('\\n');
        const tipsElement = document.getElementById('tips_and_notes');
        for (let i = 0; i < tips.length; i++) {
            tipsElement.appendChild(document.createTextNode(tips[i]));
            tipsElement.appendChild(document.createElement('br'));
        }

        // CREATOR
        const creator = document.getElementById('creator');
        creator.innerText = "Created By: " + json.author;
        currUser = json.author;

        // preferences & allergens section
        let prefCheck = json.preferences;
        for(let i = 0; i < prefCheck.length; i++){
            if(parseInt(prefCheck[i]) === 1){
                const item = document.createElement('li');
                if(i < 8){
                    item.appendChild(document.createTextNode(prefArray[i]));
                    prefHolder.appendChild(item);
                }
                else{
                    item.appendChild(document.createTextNode(prefArray[i]));
                    allergenHolder.appendChild(item);
                }
            }
        }

        //recipe name
        const title = document.getElementById('recipeName');
        title.innerText = "Recipe: " + json.recipe_name;

        //pictures
        picture.style.backgroundImage = `url(${json.recipe_picture.split(' ').join('+')})`;
    }

    //COMMENTS
    const comments = document.getElementById('comment');
    const req = new Request(fixURL(window.location.href) + '/comment/read?recipe_id=' + currRecipe , {method: 'GET'});
    const res = await fetch(req);
    if(res.ok){
        const comm = await res.json();
        for(let i = 0; i < comm.length; i++){
            const content = document.createElement("span");
            content.className = "com";
            comments.appendChild(content);
            comments.appendChild(document.createTextNode(comm[i].sender + ' said: ' + comm[i].content + '\n'));
            comments.appendChild(document.createElement("br"));
        }
    }
}

commentBox.addEventListener('click', async(e) =>{
    if(e.target.id === "message" && e.target.innerText === "Send!"){
        const message = document.getElementById('commentHere').value;
        if(message === ''){
            alert('Please enter some text before trying to send a message!');
        }
        else{
            const res = fetch('/recipe/comment/new', { 
                mode: 'cors',
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    //"Content-type": "application/json; raw"
                },
                body: "sender=" + window.localStorage.getItem('username') + "&recipeID=" + window.localStorage.getItem('cur_recipe_id') + "&text=" + message
            })
            .then(async function (res) {
            if(res.ok){
                const comments = document.getElementById('comment');
                comments.innerText = ''
                const req = new Request(fixURL(window.location.href) + '/comment/read?recipe_id=' + currRecipe , {method: 'GET'});
                const res = await fetch(req);
                if(res.ok){
                    const comm = await res.json();
                    for(let i = 0; i < comm.length; i++){
                        const content = document.createElement("span");
                        content.className = "com";
                        comments.appendChild(content);
                        comments.appendChild(document.createTextNode(comm[i].sender + ' said: ' + comm[i].content + '\n'));
                        comments.appendChild(document.createElement("br"));
                    }
                }
            }});
        }
    }
});

window.onload = renderRecipe;