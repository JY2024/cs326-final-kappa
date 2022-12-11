import { encodeImageAsURL } from "./utility.js";
const settings = document.getElementById('settings');
settings.addEventListener('click', () => {
    window.location = "/profile-settings-personal-info.html";
});

//Listeners
document.getElementById('back').addEventListener('click', toFeed)

initializePage();

function toFeed() {
    window.location = "/main-feed.html";
}

function initializePage() {
    fetchMyRecipes();
    fetchUserInfo();
}

function fetchUserInfo() {
    fetch('/user/read?username=' + localStorage.getItem('cur_user_viewing'))
        .then(response => response.json())
        .then(response => {
            displayUserInfoParser(response);
        });
}

function displayUserInfoParser(userJSON) {
    let username = userJSON.username;
    let prefNumArr = userJSON.preferences;
    let desc = userJSON.description;
    let pic = userJSON.profile_picture;
    let realname = userJSON.display_name;
    let prefArr = [];
    for (const index in prefNumArr) {
        if (index === "0" && prefNumArr[index] === "1") {
            prefArr.push("Vegetarian");
        }
        if (index === "1" && prefNumArr[index] === "1") {
            prefArr.push("Vegan");
        }
        if (index === "2" && prefNumArr[index] === "1") {
            prefArr.push("Gluten Free");
        }
        if (index === "3" && prefNumArr[index] === "1") {
            prefArr.push("Dairy Free");
        }
        if (index === "4" && prefNumArr[index] === "1") {
            prefArr.push("Pescetarian");
        }
        if (index === "5" && prefNumArr[index] === "1") {
            prefArr.push("Keto");
        }
        if (index === "6" && prefNumArr[index] === "1") {
            prefArr.push("Low Carb");
        }
        if (index === "7" && prefNumArr[index] === "1") {
            prefArr.push("Protein");
        }
        if (index === "8" && prefNumArr[index] === "1") {
            prefArr.push("Shellfish");
        }
        if (index === "9" && prefNumArr[index] === "1") {
            prefArr.push("Nuts");
        }
        if (index === "10" && prefNumArr[index] === "1") {
            prefArr.push("Soy");
        }
        if (index === "11" && prefNumArr[index] === "1") {
            prefArr.push("Sugar Free");
        }
    }
    userCard(username, realname, prefArr, desc, pic);
}

function userCard(username, realname, prefs, desc, pic) {
    document.getElementById("userName").innerText = username;
    document.getElementById("realName").innerText = realname;
    document.getElementById("userDescription").innerText = desc;
    document.getElementById("profPic").setAttribute("src", pic.split(' ').join('+'));
    let prefCard = document.getElementById("prefIcons");
    for (const index in prefs) {
        console.log(prefs[index]);
        let currDiv = document.createElement("span");
        let currID = "badge" + prefs[index];
        currDiv.setAttribute("id", currID);
        currDiv.setAttribute("class", "badge rounded-pill text-bg-success");
        currDiv.innerText = prefs[index];
        prefCard.appendChild(currDiv);
    }
}

function fetchMyRecipes() {
    fetch('/recipe/list/my?username=' + localStorage.getItem('cur_user_viewing'))
        .then(response => response.json())
        .then(response => {
            displayRecipeParser(response);
        })
}

function myRecipeCard(recipeName, numLikes, numComments, colID, img, recID) {
    let newCard = document.createElement("div");
    newCard.className = "card";
    let cardImg = document.createElement("img");
    cardImg.className = "card-img-top";
    cardImg.style = "width: 18rem;";
    cardImg.src = img;
    newCard.appendChild(cardImg);
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    let title = document.createElement("a");
    title.className = "card-title text-start";
    title.innerText = recipeName;
    title.addEventListener('click', () => {
        window.localStorage.setItem('cur_recipe_id', recID);
        window.location = "/recipe.html";
    });
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

function displayRecipeParser(recipeList) {
    for (const index in recipeList) {
        let curName = (recipeList[index])["recipe_name"];
        let curID = "recipe" + index;
        let recID = (recipeList[index])["recipe_id"];
        let img = (recipeList[index])["recipe_picture"];
        let likes = (recipeList[index])["likes"];
        let comments = (recipeList[index])["comments"];
        myRecipeCard(curName, likes, comments, curID, img.split(' ').join('+'), recID);
    }
}