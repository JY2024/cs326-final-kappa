// DataBase Functions, NOTE: Still returns dummy data
// Authorization
export function authUserObj(req) {
    if (req.query.email !== 'test' || req.query.password !== "test") {
        console.log("in here");
        return {Status: 'ERROR'}
    }
    return {Status: 'SUCCESS'}
}

// [1] User Functions
export function createUserObj(username, password, displayName) {
    return {status: 'SUCCESS', username: username, password: password, displayName: displayName};
}

export function getUserInfo(username) {
    return JSON.stringify({username: "Jay1024", display_name: "Jay", profile_picture: "filename.jpeg", location: "Amherst", preferences: [1,0,0,0,0,0,0], description: "I like to eat food"});
}

// NOTE: need more recipe database functions AND maybe functions for update recipe. These need to be stringified btw (maybe idk)
export function getLikedRecipes(username) {
    //This will get full list of recipes liked by the user
    //return [{recipeID: 999, recipe_name: "Pizza", ...}, {recipeID: 1000, recipe_name: "Salad", ...}, {recipeID: 1001, recipe_name: "Soup", ...}];
}

export function getMyRecipes(username) {
    //This will get full list of recipes owned by the user
    //return [{recipeID: 999, recipe_name: "Pizza", ...}, {recipeID: 1000, recipe_name: "Salad", ...}, {recipeID: 1001, recipe_name: "Soup", ...}];
}

export function getOtherRecipes(username) {
    //This will get full list of recipes that are not owned by or liked by the user AND match the preference of the user
    //Preferences can be gotten from user table, likes from the likes table.
    //return [{recipeID: 999, recipe_name: "Pizza", ...}, {recipeID: 1000, recipe_name: "Salad", ...}, {recipeID: 1001, recipe_name: "Soup", ...}];
}

export function updateDescriptionObj(username, desc) {
    return {status: "SUCCESS", username: username};
}

export function updateLocationObj(username, loc) {
    return {status: "SUCCESS", username: username};
}

export function updateProfilePictureObj(username, path, blob) {
    return {status: "SUCCESS", username: username};
}

export function existsUser(username) {
    return true;
}

export function deleteUserObj(username) {
    return {Status: "SUCCESS", username: username};
}

// [2] Recipe Functions
export function createRecipeObj(title, author, ingredients, instructions) {
    return {status: 'SUCCESS', recipe_name: 'MyPiza', recipeId: 1987};
}
export function existsRecipe(recipeID) {
    return true;
}
export function getRecipeInfo(recipeID) {
    return JSON.stringify({recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "filename.jpeg",
    ingredients: [{"Dough": "3 pounds"}, {"Sauce": "2 gallons"}, {"Cheese" : "3 cups"}],
    instructions: ["knead dough", "spread sauce", "sprinkle cheese"], preferences: [0,1,0,0,0,0,0],
    time: "approx 90 minutes", likes:2, rating: 3.4, "ingredients_notes":"Feel free to experiment with toppings!",
    tips_and_notes: "I love pizza, and I bet you do too! Come check out my profile for more pizza recipes! I'd love to hear about your spin on my recipe!"});
}
export function deleteRecipeObj(recipeID, username) {
    return {Status: "SUCCESS", recipeID: recipeID};
}


// [3] Like Functions
export function createLikeObj(sender, recipeID) {
    //if user has already liked this recipe, they cannot like it again, return error.
    return {Status: 'SUCCESS', recipeID: recipeID, likeCount:1}
}
export function deleteLikeObj(sender, recipeID) {
    return {Status: 'SUCCESS', recipeID: recipeID, likeCount:0}
}

// [4] Comment Functions
export function createCommentObj(sender, recipeID, text) {
    return {Status: 'SUCCESS', commentID: 1};
}
export function getCommentInfo(commentID) {
    return JSON.stringify({Status: 'SUCCESS', sender: 'Jay', recipeID: 1987, text: 'this recipe gave me heartburn'});
}
export function updateCommentObj(comment_id, text) {
    return {Status: 'SUCCESS', commentID: 1};
}
export function existsComment(commentID) {
    if(commentID == 99999999) {
        return false;
    }
    return true;
}
export function deleteCommentObj(commentID, username) {
    return {Status: "SUCCESS", commentID: commentID};
}

// [5] Chat Functions


// [6] Message Functions