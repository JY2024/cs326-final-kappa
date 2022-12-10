import { encodeImageAsURL } from "./utility.js";
const settings = document.getElementById('settings');
settings.addEventListener('click', () =>{
    window.location = "/profile-settings-personal-info.html";
});

//Listeners
document.getElementById('buttonPost').addEventListener('click',postRecipe);
document.getElementById('back').addEventListener('click', toFeed)
document.getElementById('savedBtn').addEventListener('click', fetchSavedRecipes);
document.getElementById('myBtn').addEventListener('click', fetchMyRecipes);

initializePage();

function toFeed(){
    window.location = "/main-feed.html";
}

function initializePage(){
    fetchMyRecipes();
    fetchUserInfo();
    window.localStorage.setItem('cur_user_viewing', window.localStorage.getItem('username'));
}

function fetchUserInfo(){
    fetch( '/user/read?username=' + localStorage.getItem('cur_user_viewing') )
        .then( response => response.json() )
        .then( response => {
            console.log(response);
            displayUserInfoParser(response);
        });
}

function displayUserInfoParser(userJSON){
    let username = userJSON.username;
    let prefNumArr = userJSON.preferences;
    let desc = userJSON.description;
    let pic = userJSON.profile_picture;
    let realname = userJSON.display_name;
    let prefArr = [];
    for(const index in prefNumArr){
        if(index === "0" && prefNumArr[index] === "1"){
            prefArr.push("Vegetarian");
        }
        if(index === "1" && prefNumArr[index] === "1"){
            prefArr.push("Vegan");
        }
        if(index === "2" && prefNumArr[index] === "1"){
            prefArr.push("Gluten Free");
        }
        if(index === "3" && prefNumArr[index] === "1"){
            prefArr.push("Dairy Free");
        }
        if(index === "4" && prefNumArr[index] === "1"){
            prefArr.push("Pescetarian");
        }
        if(index === "5" && prefNumArr[index] === "1"){
            prefArr.push("Keto");
        }
        if(index === "6" && prefNumArr[index] === "1"){
            prefArr.push("Low Carb");
        }
        if(index === "7" && prefNumArr[index] === "1"){
            prefArr.push("Protein");
        }
        if(index === "8" && prefNumArr[index] === "1"){
            prefArr.push("Shellfish");
        }
        if(index === "9" && prefNumArr[index] === "1"){
            prefArr.push("Nuts");
        }
        if(index === "10" && prefNumArr[index] === "1"){
            prefArr.push("Soy");
        }
        if(index === "11" && prefNumArr[index] === "1"){
            prefArr.push("Sugar Free");
        }
    }
    userCard(username, realname, prefArr, desc, pic);
}

function userCard(username, realname, prefs, desc, pic){
    document.getElementById("userName").innerText = username;
    document.getElementById("realName").innerText = realname;
    document.getElementById("userDescription").innerText = desc;
    document.getElementById("profPic").setAttribute("src", pic.split(' ').join('+'));
    let prefCard = document.getElementById("prefIcons");
    for(const index in prefs){
        console.log(prefs[index]);
        let currDiv = document.createElement("span");
        let currID = "badge" + prefs[index];
        currDiv.setAttribute("id", currID);
        currDiv.setAttribute("class", "badge rounded-pill text-bg-success");
        currDiv.innerText = prefs[index];
        prefCard.appendChild(currDiv);
    }
}

function fetchSavedRecipes(){
    console.log("Saved recipes");
    fetch( '/recipe/list/saved?username=' + localStorage.getItem('cur_user_viewing'))
    .then( response => response.json() )
    .then( response => {
        // Do something with response.
        //response.send(readSavedRecipes(request,response));
        console.log(response);
        displayRecipeParser(response, false)
    } );
}

function fetchMyRecipes(){
    fetch( '/recipe/list/my?username=' + localStorage.getItem('cur_user_viewing'))
    .then( response => response.json() )
    .then( response => {
        displayRecipeParser(response, true);
    })
}

async function postRecipe(){
 var recipeName=document.getElementById('titleInput').value
 var author= localStorage.getItem('cur_user_viewing');
 //var author=document.getElementById('author').value
 var ingredients=document.getElementById('ingredientInput').value
 var instructions=document.getElementById('intructionInput').value
 const picString = await encodeImageAsURL(document.getElementById('upload'));
 var preferencesArr=[document.getElementById('prefVegetarian').checked, document.getElementById('prefVegan').checked,document.getElementById('prefGlutenFree').checked,document.getElementById('prefDairyFree').checked,document.getElementById('prefPesc').checked,document.getElementById('prefKeto').checked,document.getElementById('prefLowCarb').checked,document.getElementById('prefProtein').checked,document.getElementById('allergenShell').checked,document.getElementById('allergenNuts').checked,document.getElementById('allergenSoy').checked,document.getElementById('prefSugarFree').checked]
 var preferences = "";
 var tips = document.getElementById('tipsText').value
 for(let i = 0; i <12;i++){
    if(preferencesArr[i] === true){
        preferences = preferences + "1";
    }
    else{
        preferences = preferences + "0";
    }
 }
 console.log(preferences);
 var time=document.getElementById('timeToPrep').value

 console.log(JSON.stringify({recipeName:recipeName, author:author, ingredients:ingredients, instructions:instructions,preferences:preferences, time:time, tips:tips}))

 fetch('/recipe/new', { 
    mode: 'cors',
    method: 'POST',
    headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        //"Content-type": "application/json; raw"
    },
    //body: {
    //title: recipeName,
    //author: author,
    //ingredients: ingredients,
    //instructions: instructions,
    //},
    body: "title=" + recipeName + "&author=" + author + "&ingredients=" + ingredients + "&instructions=" + instructions + "&preferences=" + preferences + "&time=" + time + "&recipe_picture=" + picString + "&tips=" + tips
  })
    .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        location.reload();
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });

};


function myRecipeCard(recipeName, numLikes, numComments, colID, img){
    let newCard = document.createElement("div");
    newCard.className = "card";
    let cardImg = document.createElement("img");
    cardImg.className = "card-img-top";
    cardImg.style = "width: 18rem;";
    cardImg.src = img;
    newCard.appendChild(cardImg);
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    let title = document.createElement("h5");
    title.className = "card-title text-start";
    title.innerText = recipeName;
    cardBody.appendChild(title);
    newCard.appendChild(cardBody);
    let likeInfo = document.createElement("p");
    likeInfo.className = "card-text text-start";
    let like = document.createElement("i");
    like.className = "bi bi-heart-fill";
    like.style.color = "lightcoral";
    like.innerText = "Matches: " + numLikes;
    likeInfo.appendChild(like);
    newCard.appendChild(likeInfo);
    let commentInfo = document.createElement("p");
    commentInfo.className = "card-text text-start";
    let comment = document.createElement("i");
    comment.className = "bi bi-chat-left-fill";
    comment.style.color = "slateblue";
    comment.innerText = "Comments: " + numComments;
    commentInfo.appendChild(comment);
    newCard.appendChild(commentInfo);
    document.getElementById(colID).appendChild(newCard);
};

function clearRecipes(){
    document.getElementById("recipe0").innerHTML = "";
    document.getElementById("recipe1").innerHTML = "";
    document.getElementById("recipe2").innerHTML = "";
    document.getElementById("recipe3").innerHTML = "";
    document.getElementById("recipe4").innerHTML = "";
    document.getElementById("recipe5").innerHTML = "";
}

function savedRecipeCard(recipeName, author, colID, img, recID){
    let newCard = document.createElement("div");
    newCard.className = "card";
    let cardImg = document.createElement("img");
    cardImg.className = "card-img-top";
    cardImg.style = "width: 18rem;";
    cardImg.setAttribute('id', recID)
    cardImg.src = img;
    newCard.appendChild(cardImg);
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    let title = document.createElement("h5");
    title.className = "card-title text-start";
    title.innerText = recipeName;
    cardBody.appendChild(title);
    newCard.appendChild(cardBody);
    let creator = document.createElement("h4");
    creator.innerText = author;
    newCard.appendChild(creator);
    let likeInfo = document.createElement("p");
    likeInfo.className = "card-text text-start";
    let like = document.createElement("i");
    let likeID = 'liked' + recID;
    like.setAttribute('id', likeID);
    like.setAttribute('recID', recID);//recipe_id
    like.className = "bi bi-heart-fill";
    like.style.color = "lightcoral";
    likeInfo.appendChild(like);
    newCard.appendChild(likeInfo);
    /*let prefInfo = document.createElement("p");
    prefInfo.className = "card-text text-start";
    
    commentInfo.appendChild(comment);
    newCard.appendChild(commentInfo);*/
    document.getElementById(colID).appendChild(newCard);
    document.getElementById(likeID).addEventListener('click',postUnlike);
    document.getElementById(recID).addEventListener('click',recipePageFunc);
};

function recipePageFunc(){
    window.localStorage.setItem('cur_recipe_id', this.getAttribute('id'));
    window.location = "/recipe.html";
}

function displayRecipeParser(recipeList, mine){
    clearRecipes();
    for(const index in recipeList){
        console.log(recipeList[index]);
        let curName = (recipeList[index])["recipe_name"];
        let curID = "recipe" + index;
        let recID = (recipeList[index])["recipe_id"];
        //let img = (recipeList[index])["img"];
        let img = (recipeList[index])["recipe_picture"];
        if(mine === true){
            let likes = (recipeList[index])["likes"];
            let comments = (recipeList[index])["comments"];
            myRecipeCard(curName, likes, comments, curID, img.split(' ').join('+'));
        }
        else{
            let author = (recipeList[index])["author"];
            savedRecipeCard(curName, author, curID, img, recID);
        }
    }
}

function postUnlike(){
    console.log(this)
    var recipe_id = Number(this.getAttribute("recid"));
    console.log(recipe_id);
    var user=localStorage.getItem('username');
    
    console.log(JSON.stringify({username:user, recipe_id:recipe_id}));
   
    fetch('/recipe/like/delete', { 
       mode: 'cors',
       method: 'POST',
       headers: {
           "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
       },
       body: "username=" + user + "&recipe_id=" + recipe_id
    })
       .then(function (data) {
           console.log('Request succeeded with JSON response', data);
           location.reload();
           //alert("Recipe " + recipe_id + " successfully unliked\n" + "By user: " + user);
       })
       .catch(function (error) {
           console.log('Request failed', error);
       });
   
   };