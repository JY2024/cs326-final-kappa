// DataBase Functions
export function authUserObj(req) {
    console.log("the email is: ", req.query.email, "and the pwd is: ", req.query.password);
    if (req.query.email !== 'test' || req.query.password !== "test") {
        console.log("in here");
        return {Status: 'ERROR'}
    }
    return {Status: 'SUCCESS'}
}

export function createUserObj(username, password, displayName) {
    console.log("createUserObj: " + username + " is added to the database");
    if (username == 'Bella') {
        return {Status: 'ERROR', Username: username, errMessage: "Username " + username + " already exists"}
    }
    return {Status: 'SUCCESS', Username: username}
}

export function getUserInfo(username) {
    console.log("getUserInfo: " + username);
    return {username: "Jay1024", display_name: "Jay", profile_picture: "filename.jpeg", location: "Amherst", preferences: [1,0,0,0,0,0,0], description: "I like to eat food"};
}

export function updateDescriptionObj(username, desc) {
    console.log("updateDescriptionObj: " + username + ", " + desc);
    if (username == 'Robert123') {
        return {Status: 'ERROR', Username: username, errMessage: "Username " + username + " doesn't exist"}
    }
    return {Status: "SUCCESS", username: username};
}

export function updateLocationObj(username, loc) {
    console.log("updateLocationObj: " + username + ", " + loc);
    if (username == 'Robert123') {
        return {Status: 'ERROR', Username: username, errMessage: "Username " + username + " doesn't exist"}
    }
    return {Status: "SUCCESS", username: username};
}

export function updateProfilePictureObj(username, path, blob) {
    console.log("updateLocationObj: " + username + ", " + path + ", " + blob);
    if (username == 'Robert123') {
        return {Status: 'ERROR', Username: username, errMessage: "Username " + username + " doesn't exist"}
    }
    return {Status: "SUCCESS", username: username};
}

export function existsUser(username) {
    if(username == 'Robert123') {
        return false;
    }
    return true;
}

export function deleteUserObj(username) {
    console.log("deleteUserObj: " + username);
    if (username == 'Robert123') {
        return {Status: 'ERROR', Username: username, errMessage: "Username " + username + " doesn't exist"}
    }
    //authentication???
    return {Status: "SUCCESS", username: username};
}

// Recipe
export function createRecipeObj(title, author, ingredients, instructions) {
    console.log("'" + title + ":" + author + ":" + ingredients + ":" + instructions + "'");
    if (title == 'Pizza' && author == "Bella") {
        return {Status: 'ERROR', Recipename: 'MyPiza', errMessage: "Recipename '" + title + "' already exists with id " + 1987}
    }
    return {Status: 'SUCCESS', Recipename: 'MyPiza', recipeId: 1987}
}
export function existsRecipe(recipeID) {
    if(recipeID == 99999999) {
        return false;
    }
    return true;
}
export function getRecipeInfo(recipeID) {
    console.log("getRecipeInfo: " + recipeID);
    if(!existsRecipe(recipeID)){
        return {Status: 'ERROR', recipeID: recipeID, errMessage: "recipeID " + recipeID + " does not exist"};
    }
    return {recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "filename.jpeg", ingredients: "dough, sauce, cheese", instruction: "knead dough, spread sauce, sprinkle cheese", preferences: [0,1,0,0,0,0,0], time: "approx 90 minutes", likes:2, rating: 3.4};
}
export function deleteRecipeObj(recipeID, username) {
    console.log("deleteRecipeObj: " + recipeID);
    if (!existsRecipe(recipeID)) {
        return {Status: 'ERROR', recipeID: recipeID, errMessage: "recipeID " + recipeID + " doesn't exist"}
    }
    if (username != 'Jay') {
        return {Status: 'ERROR', Username: username, errMessage: "Username " + username + " doesn't own this recipe"}
    }
    return {Status: "SUCCESS", recipeID: recipeID};
}

export function getLikedRecipes(username) {
    console.log("getLikedRecipes: " + username);
    //This will get full list of recipes liked by the user
    //return [{recipeID: 999, recipe_name: "Pizza", ...}, {recipeID: 1000, recipe_name: "Salad", ...}, {recipeID: 1001, recipe_name: "Soup", ...}];
}

export function getMyRecipes(username) {
    console.log("getMyRecipes: " + username);
    //This will get full list of recipes owned by the user
    //return [{recipeID: 999, recipe_name: "Pizza", ...}, {recipeID: 1000, recipe_name: "Salad", ...}, {recipeID: 1001, recipe_name: "Soup", ...}];
}

export function getOtherRecipes(username) {
    console.log("getOtherRecipes: " + username);
    //This will get full list of recipes that are not owned by or liked by the user AND match the preference of the user
    //Preferences can be gotten from user table, likes from the likes table.
    //return [{recipeID: 999, recipe_name: "Pizza", ...}, {recipeID: 1000, recipe_name: "Salad", ...}, {recipeID: 1001, recipe_name: "Soup", ...}];
}

//Likes

export function createLikeObj(sender, recipeID) {
    console.log("createLikeObj: " + sender + ", " + recipeID);
    if (!existsRecipe(recipeID)) {
        return {Status: 'ERROR', recipeID: recipeID, errMessage: 'recipeID does not exist'};
    }
    //if user has already liked this recipe, they cannot like it again, return error.
    return {Status: 'SUCCESS', recipeID: recipeID, likeCount:1}
}
export function deleteLikeObj(sender, recipeID) {
    console.log("deleteLikeObj: " + sender + ", " + recipeID);
    if (!existsRecipe(recipeID)) {
        return {Status: 'ERROR', recipeID: recipeID, errMessage: 'recipeID does not exist'};
    }
    return {Status: 'SUCCESS', recipeID: recipeID, likeCount:0}
}

// Comments
export function createCommentObj(sender, recipeID, text) {
    console.log("createCommentObj: " + sender + ", " + recipeID + ", " + text);
    if(!existsRecipe(recipeID)){
        return {Status: 'ERROR', recipeID: recipeID, errMessage: 'recipeID does not exist'};
    }
    return {Status: 'SUCCESS', commentID: 1};
}
export function getCommentInfo(commentID) {
    console.log("getCommentInfo: " + commentID);
    if(!existsRecipe(commentID)){
        return {Status: 'ERROR', commentID: commentID, errMessage: 'commentID does not exist'};
    }
    return {Status: 'SUCCESS', sender: 'Jay', recipeID: 1987, text: 'this recipe gave me heartburn'};
}
export function existsComment(commentID) {
    if(commentID == 99999999) {
        return false;
    }
    return true;
}
export function deleteCommentObj(commentID, username) {
    console.log("deleteCommentObj: " + commentID + ", " + username);
    if (commentID == 99999999) {
        return {Status: 'ERROR', commendID: commentID, errMessage: "commentID " + commentID + " doesn't exist"};
    }
    if (commentID == 99999998 && username == "Bella") {
        return {Status: 'ERROR', Username: username, commentID: commentID, errMessage: "Username " + username + " does not own comment " + commentID};
    }
    return {Status: "SUCCESS", commentID: commentID};
}