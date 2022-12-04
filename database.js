// const { Client } = require('pg');
import pg from 'pg';
const {Client} = pg;
/*const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});*/
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
})
client.connect();

import * as SQL from './webPages/jsFiles/querybuilder.js';
import { arrayOfObjectsToArray, atLeastFiveMatch } from './webPages/jsFiles/utility.js';

// DataBase Functions, NOTE: Still returns dummy data
// Authorization
export async function authUserObj(req) {
    if (req.query.email === req.query.password && req.query.email !== "") {
        let res = await client.query(SQL.sqlSelectUser(), [req.query.email]);
        if(res.rowCount !== 0){
            return {status: 'SUCCESS'};
        }
    }
    return {status: 'ERROR'}
}

// [1] User Functions
export async function createUserObj(username, password, displayName) {
    const res = await client.query(
        "INSERT INTO user_T (username, profile_picture, display_name, location, preferences, description, hide_recipes) VALUES ($1, $2, $3, $4, $5, $6, $7);", [username, 'default profile picture', displayName, '', '000000000000', '', false]
    );
    return JSON.stringify({status: 'SUCCESS', username: username, password: password, displayName: displayName});
}

export async function getUserInfo(username) {
    const res = await client.query(
        "SELECT * FROM user_T WHERE username=$1", [username]
    );
    return JSON.stringify(res.rows[0]);
}

// export async function getSavedRecipes(username) {
//     const res1 = await client.query(
//         "SELECT recipe_id FROM like_T WHERE username=$1", [username]
//     );
//     let recipe_ids = arrayOfObjectsToArray(res1.rows, 'recipe_id');
//     const res2 = await client.query(
//         "SELECT * FROM recipe_T LEFT JOIN like_T ON (recipe_T.recipe_id = any($1))", [recipe_ids]
//     );
//     return JSON.stringify(res2.rows);
// }

export async function getSavedRecipes(username) {
    let res = await client.query(SQL.sqlSavedRecipes(), [username]);
    return JSON.stringify(res.rows);
}

// export async function getMyRecipes(username) {
//     const res = await client.query(
//         "SELECT * FROM recipe_T WHERE author=$1", [username]
//     );
//     return JSON.stringify(res.rows);
// }

export async function getMyRecipes(username) {
    let res = await client.query(SQL.sqlMyRecipes(), [username]);
    return JSON.stringify(res.rows);
}


export async function getOtherRecipes(username) {
    //This will get full list of recipes that are not owned by or liked by the user AND match the preference of the user
    //Preferences can be gotten from user table, likes from the likes table.
    const userPreferences = JSON.parse(await getUserInfo(username)).preferences;
    // get liked recipes
    const res1 = await client.query(
        "SELECT recipe_id FROM like_T WHERE username=$1", [username]
    );
    const liked = arrayOfObjectsToArray(res1.rows, 'recipe_id');
    // get my own recipes
    const res2 = await client.query(
        "SELECT recipe_id FROM recipe_T WHERE author=$1", [username]
    );
    const owned = arrayOfObjectsToArray(res2.rows, 'recipe_id');
    const res3 = await client.query(
        "SELECT * FROM recipe_T WHERE NOT recipe_T.recipe_id = any($1) AND NOT recipe_T.recipe_id = any($2)", [liked, owned]
    );
    // return things that match at least 5 preferences
    return JSON.stringify(res3.rows.filter(recipe => {
        return atLeastFiveMatch(recipe.preferences.split(''), userPreferences);
    }));
}

export async function updateUser(username, profile_pic, location, pref, desc, hide_recipes, display_name) {
    console.log('type of hide recipes is ' + typeof hide_recipes);
    const user_hide_recipes = JSON.parse(await getUserInfo(username)).hide_recipes;
    let str = 'UPDATE user_T SET';
    if (profile_pic !== 'same') {
        str += ' profile_picture = \'' + profile_pic + '\',';
    }
    if (location !== 'same') {
        str += ' location = \'' + location + '\',';
    }
    if (pref !== 'same') {
        str += ' preferences = \'' + pref + '\',';
    }
    if (desc !== 'same') {
        str += ' description = \'' + desc + '\',';
    }
    if (display_name !== 'same') {
        str += ' display_name = \'' + display_name + '\',';
    }
    console.log('your query string is: ' + str.substring(0, str.length - 1) + ' where username = $1');
    await client.query(str + 'hide_recipes=$1 WHERE username = $2', [hide_recipes === 'same' ? user_hide_recipes : parseInt(hide_recipes), username]);
}

export async function existsUser(username) {
    const res = await client.query(
        "SELECT * FROM user_T WHERE username=$1", [username]
    );
    return res.rows.length > 0;
}

export async function deleteUserObj(username) {
    // delete a user's likes
    const res1 = await client.query(
        "DELETE FROM like_T WHERE username=$1", [username]
    );
    // delete a user's comments
    const res2 = await client.query(
        "DELETE FROM comment_T WHERE sender=$1", [username]
    );
    // delete user's recipes
    const res3 = await client.query(
        "DELETE FROM recipe_T WHERE author=$1", [username]
    );
    // delete user's chats DO LATER
    // delete user's messages DO LATER
    // delete user
    const res6 = await client.query(
        "DELETE FROM user_T WHERE username=$1", [username]
    );
    return JSON.stringify({Status: "SUCCESS", username: username});
}

// [2] Recipe Functions
export async function getRandomRecipe(username) {
    const recipes = JSON.parse(await getOtherRecipes(username));
    return JSON.stringify(recipes[Math.floor(Math.random() * recipes.length)]);
}
export async function createRecipeObj(title, author, ingredients, instructions, preferences, time) {
    try{
        await client.query(SQL.sqlCreateRecipe(),[title,author,ingredients,instructions,preferences,time]);
    }
    catch(err){
        console.log(err.stack);
        return {status: "ERROR"};
    }
    return {status: 'SUCCESS'};
}
export function existsRecipe(title, author) {
    return false;
}
export async function getRecipeInfo(recipeID) {
    const res = await client.query(
        "SELECT * FROM recipe_t WHERE recipe_id=$1", [recipeID]
    );
    return JSON.stringify(res.rows[0]);
}
export function deleteRecipeObj(recipeID, username) {
    return {Status: "SUCCESS", recipeID: recipeID};
}
// export var currentRecipe = 1987;
// export function updateCurrentRecipe(recipeID){
//     currentRecipe = recipeID;
// }


// [3] Like Functions
export async function createLikeObj(sender, recipe_id) {
    //if user has already liked this recipe, they cannot like it again, return error.
    try{
        await client.query(SQL.sqlCreateLike(),[sender,recipe_id]);
    }
    catch(err){
        console.log(err.stack);
        return {status: "ERROR"};
    }
    return {status: 'SUCCESS'};
}

export async function deleteLikeObj(sender, recipe_id) {
    try{
        await client.query(SQL.sqlDeleteLike(),[sender,recipe_id]);
    }
    catch(err){
        console.log(err.stack);
        return {status: "ERROR"};
    }
    return {status: 'SUCCESS'};
}

// [4] Comment Functions
async function existsID(id) {
    const res = await client.query(
        "SELECT * FROM recipe_T WHERE recipe_id=$1", [id]
    );
    return res.rows.length > 0;
}
export async function createCommentObj(sender, recipeID, text) {
    const res = await client.query(
        "INSERT INTO comment_T (sender, recipe_id, content) VALUES ($1, $2, $3);", [sender, recipeID, text]
    );
    return JSON.stringify({Status: 'SUCCESS'});
}
export async function getCommentInfo(commentID) {
    const res = await client.query(
        "SELECT * FROM comment_T WHERE comment_id=$1", [commentID]
    );
    return JSON.stringify(res.rows[0]);
}
export async function updateCommentObj(commentID, text) {
    const res = await client.query(
        "UPDATE comment_T SET content=$1 WHERE comment_T.comment_id=$2", [text, commentID]
    );
    return JSON.stringify({status: "SUCCESS"});
}
export async function existsComment(commentID) {
    const res = await client.query(
        "SELECT * FROM comment_T WHERE comment_id=$1", [commentID]
    );
    return res.rows.length > 0;
}
export async function deleteCommentObj(commentID) {
    const res = await client.query(
        "DELETE FROM comment_T WHERE comment_id=$1", [commentID]
    );
    return JSON.stringify({Status: "SUCCESS"});
}


export function tempGetRecipeInfo(recipeID) {
    return JSON.stringify({recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "pizza.jpg",
    ingredients: [{"Dough": "3 pounds"}, {"Sauce": "2 gallons"}, {"Cheese" : "3 cups"}], recipeID: 197,
    instructions: ["knead dough", "spread sauce", "sprinkle cheese"], preferences: [0,1,0,0,0,0,0],
    time: "approx 90 minutes", likes:2, rating: 3.5, "ingredients_notes":"Feel free to experiment with toppings!",
    tips_and_notes: "I love pizza, and I bet you do too! Come check out my profile for more pizza recipes! I'd love to hear about your spin on my recipe!"});
}
// [5] Chat Functions
export var currChat;
export async function createChat(sender, reciever) {
    currChat = reciever;
    const res = await client.query(
        "INSERT INTO chat_t (sender_id, reciever_id) VALUES ($1, $2)", [sender, reciever]
    );
    return JSON.stringify({Status: 'SUCCESS', sender: 'test', reciever: "Jay", time:"11:01"});
}
export async function getChat(user) {
    const res = await client.query(
        "SELECT * FROM chat_t WHERE sender_id=$1 OR reciever_id=$1", [user]
    ); //Chat: {sender_id: int, reciever_id: int, chat_id: int}
    // return JSON.stringify(res.rows);
    return JSON.stringify([{sender: 'test', reciever: "Jay"}, {sender: 'test', reciever: "Bella"}, {sender: 'test', reciever: "Daktshh"}]);
}
export function deleteChat(user, reciever){
    return {Status: "SUCCESS", reciever: reciever};
}


// [6] Message Functions
export async function getMessages(chatID) { 
    const res = await client.query(
        "SELECT * FROM message_t WHERE chat_id=$1", [chatID]
    ); //Message: {sender_id: int, chat_id: int, text: string, time: int}
    // return JSON.stringify(res.rows);
    return JSON.stringify([{sender: 'test', reciever: "Jay", text: "Hey! I had a couple questions regarding your recipe.", time:"11:01"}, 
    {sender: 'Jay', reciever: "test", text: "I'd be happy to help!", time:"11:02"}, 
    {sender: 'test', reciever: "Jay", text: "Are there any substitues we could use for dairy?", time:"11:05"}]);
}