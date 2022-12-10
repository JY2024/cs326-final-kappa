const profile = document.getElementById('profile');
const settings = document.getElementById('settings');
const chat = document.getElementById('messages');
const prefs = document.getElementById('prefs');
const prefHolder = document.getElementById('preferences');
const allergenHolder = document.getElementById('allergens');
const picture = document.querySelector('.imcol'); //used to be EBYID('image')
const commentBox = document.getElementById('comments');
let currUser = '';
let currRecipe = '';
let prefArray = ["Vegetarian", "Vegan", "Gluten Free", "Dairy Free", "Pescetarian", "Keto", "Low in Carbs", "High in Protein",
                "Shellfish", "Nuts", "Soy", "Sugar"];

profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
settings.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});
chat.addEventListener('click', () =>{
    window.localStorage.setItem('chat-user', currUser);
    window.location = "/chat.html";
});
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
    currRecipe = window.localStorage.getItem('cur_recipe_id');
    // console.log("recipeis: ", currRecipe);
    const request = new Request(fixURL(window.location.href) + '/recipe/read?recipeID=' + currRecipe , {method: 'GET'}); //changed it to tempread
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

        //pictures
        picture.style.backgroundImage = `url(${json.recipe_picture})`;
        // picture.style.backgroundImage = `url(../${json.recipe_picture})`;
    }

    //COMMENTS
    const comments = document.getElementById('comment');
    const req = new Request(fixURL(window.location.href) + '/comment/read?recipe_id=' + currRecipe , {method: 'GET'});
    const res = await fetch(req);
    if(res.ok){
        const comm = await res.json();
        // const content = document.createElement('p');
        for(let i = 0; i < comm.length; i++){
            // const item = document.createElement('p');
            // item.innerText = comm[i].sender + ' said: ' + comm[i].content;
            // content.appendChild(item);
            const content = document.createElement("span");
            content.className = "com";
            comments.appendChild(content);
            comments.appendChild(document.createTextNode(comm[i].sender + ' said: ' + comm[i].content + '\n'));
            comments.appendChild(document.createElement("br"));
        }
        // comments.appendChild(content);
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
                // use local storage instead of test 
                // use the above with req.body.title, req.body.author. etcc
            }) // CHANGE THE IDS of the span which has ID comment and the text box which also has ID comment - will fuck up when getting element by id
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

// async function renderRecipe() {
//     const request = new Request(fixURL(window.location.href) + '/recipe/tempread?recipeID=' + 1987 , {method: 'GET'}); //changed it to tempread
//     const response = await fetch(request);
//     if (response.ok) {
//         const json = await response.json();
//         // INGREDIENTS
//         const ingredList = document.getElementById('ingredients');
//         const listHolder = document.createElement('div');
//         for (const ingred of json.ingredients) {
//             const ingredName = Object.keys(ingred)[0];
//             const amount = ingred[ingredName];
//             const listElement = document.createElement('li');
//             const smallElement = document.createElement('small');
//             smallElement.appendChild(document.createTextNode(amount));
//             listElement.appendChild(document.createTextNode(ingredName + ' '));
//             listElement.appendChild(smallElement);
//             listHolder.appendChild(listElement);
//         }
//         ingredList.appendChild(listHolder);
//             // INGREDIENTS NOTES
//         document.getElementById('ingredients_notes').innerHTML = json.ingredients_notes;
        
//         // INSTRUCTIONS
//         const instructionsHolder = document.getElementById('instructions');
//         for (let i = 1; i <= json.instructions.length; i++) {
//             instructionsHolder.appendChild(document.createTextNode(i + '. ' + json.instructions[i - 1]));
//             instructionsHolder.appendChild(document.createElement('br'));
//         }

//         // TIPS AND NOTES
//         const tipsSection = document.getElementById('tips_and_notes');
//         tipsSection.innerHTML = json.tips_and_notes;

//         // CREATOR
//         const creator = document.getElementById('creator');
//         creator.innerText = "Created By: " + json.recipe_author;
//         currUser = json.recipe_author;
//     }
//     //COMMENTS
//     const comments = document.getElementById('comment');
//     const req = new Request(fixURL(window.location.href) + '/comment/read?comment_id=' + 1987 , {method: 'GET'});
//     const res = await fetch(req);
//     if(res.ok){
//         const json = await res.json();
//         comments.innerText = json.text;
//     }
// }
window.onload = renderRecipe;