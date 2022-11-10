//const { request } = require("express");

//const { response } = require("express");

//Listeners
document.getElementById('buttonPost').addEventListener('click',postRecipe);
document.getElementById('savedBtn').addEventListener('click', fetchSavedRecipes);
document.getElementById('myBtn').addEventListener('click', fetchMyRecipes);

//window.onload = fetchMyRecipes;

function fetchSavedRecipes(){
    console.log("Saved recipes");
    fetch( '/recipe/list/saved?username=jay1024' )
    .then( response => response.json() )
    .then( response => {
        // Do something with response.
        //response.send(readSavedRecipes(request,response));
        console.log(response);
        displayRecipeParser(response, false)
    } );
}

function fetchMyRecipes(){
    console.log("My Recipes");
    fetch( '/recipe/list/my?username=jay1024' )
    .then( response => response.json() )
    .then( response => {
        displayRecipeParser(response, true);
    })
}

function postRecipe(){
 var recipeName=document.getElementById('titleInput').value
 var author="not_a_parrot_25"
 //var author=document.getElementById('author').value
 var ingredients=document.getElementById('ingredientInput').value
 var instructions=document.getElementById('intructionInput').value
 var preferences=[document.getElementById('prefVegetarian').checked, document.getElementById('prefVegan').checked,document.getElementById('prefGlutenFree').checked,document.getElementById('prefDairyFree').checked,document.getElementById('prefPesc').checked,document.getElementById('prefKeto').checked,document.getElementById('prefLowCarb').checked,document.getElementById('prefProtein').checked,document.getElementById('allergenShell').checked,document.getElementById('allergenNuts').checked,document.getElementById('allergenSoy').checked,document.getElementById('prefSugarFree').checked]
 var time=document.getElementById('timeToPrep').value

 console.log(JSON.stringify({recipeName:recipeName, author:author, ingredients:ingredients, instructions:instructions,preferences:preferences, time:time}))

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
    body: "title=" + recipeName + "&author=" + author + "&ingredients=" + ingredients + "&instructions=" + instructions + "&preferences=" + preferences + "&time" + time
  })
    .then(function (data) {
        console.log('Request succeeded with JSON response', data);
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
    cardImg.src = "./images/" + img;
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

function savedRecipeCard(recipeName, author, colID, img){
    let newCard = document.createElement("div");
    newCard.className = "card";
    let cardImg = document.createElement("img");
    cardImg.className = "card-img-top";
    cardImg.style = "width: 18rem;";
    cardImg.src = "./images/" + img;
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
    like.className = "bi bi-heart-fill";
    like.style.color = "lightcoral";
    likeInfo.appendChild(like);
    newCard.appendChild(likeInfo);
    /*let prefInfo = document.createElement("p");
    prefInfo.className = "card-text text-start";
    
    commentInfo.appendChild(comment);
    newCard.appendChild(commentInfo);*/
    document.getElementById(colID).appendChild(newCard);
};

function displayRecipeParser(recipeList, mine){
    clearRecipes();
    for(const index in recipeList){
        console.log(recipeList[index]);
        let curName = (recipeList[index])["recipe_name"];
        let curID = "recipe" + index;
        let img = (recipeList[index])["img"]
        if(mine === true){
            let likes = (recipeList[index])["likes"];
            let comments = (recipeList[index])["comments"];
            myRecipeCard(curName, likes, comments, curID, img);
        }
        else{
            let author = (recipeList[index])["author"];
            savedRecipeCard(curName, author, curID, img);
        }
    }
}
/*
myRecipeCard("Chicken", 5, 3, "recipe1");
myRecipeCard("Pasta", 3, 2, "recipe2");
myRecipeCard("Pie", 2, 5, "recipe3");
myRecipeCard("Pizza", 0, 1, "recipe4");
myRecipeCard("Rice", 0, 0, "recipe5");
myRecipeCard("Bread", 5, 1, "recipe6");*/
fetchMyRecipes();