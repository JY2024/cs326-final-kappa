import pg from 'pg';
const {Client} = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});
client.connect();

import * as SQL from './webPages/jsFiles/querybuilder.js';
import * as auth from './auth.js';
import { arrayOfObjectsToArray, atLeastFiveMatch } from './webPages/jsFiles/utility.js';
import * as miniCrypt from './miniCrypt.js';
const MC = miniCrypt.MiniCrypt;

// DataBase Functions, NOTE: Still returns dummy data
// Authorization
export async function authUserObj(req) {
    if (req.body.email !== "") {
        let res = await client.query(SQL.sqlAuthUser(), [req.body.email]);
        if(res.rowCount !== 0){
            let correct = auth.decrypt(req.body.password, res.rows[0].salt, res.rows[0].pwencrypted);
            if(correct){
                return {status: 'SUCCESS'};
            }
        }
    }
    return {status: 'ERROR'}
}

// [1] User Functions
export async function createUserObj(username, password, displayName) {
    const res = await client.query(
        "INSERT INTO user_T (username, profile_picture, display_name, location, preferences, description, hide_recipes) VALUES ($1, $2, $3, $4, $5, $6, $7);", [username, '', displayName, '', '000000000000', '', false]
    );
    let saltHash = auth.encrypt(password);
    console.log(saltHash);
    await client.query(
        "INSERT INTO password_T (username, salt, pwEncrypted) VALUES ($1, $2, $3);", [username, saltHash[0], saltHash[1]]
    );
    return JSON.stringify({status: 'SUCCESS', username: username, password: password, displayName: displayName});
}

export async function getUserInfo(username) {
    const res = await client.query(
        "SELECT * FROM user_T WHERE username=$1", [username]
    );
    return JSON.stringify(res.rows[0]);
}

export async function getSavedRecipes(username) {
    let res = await client.query(SQL.sqlSavedRecipes(), [username]);
    return JSON.stringify(res.rows);
}

export async function getMyRecipes(username) {
    let res = await client.query(SQL.sqlMyRecipes(), [username]);
    return JSON.stringify(res.rows);
}


//Retrieves a full list of recipes that are not owned by or liked by the user AND match at least 5 prefereneces of the user
//getOtherRecipes(username: string): JSON.stringify(Array<{ contains recipe info}>)
export async function getOtherRecipes(username) {
    const userPreferences = JSON.parse(await getUserInfo(username)).preferences;
    // get liked recipes
    const res1 = await client.query(
        "SELECT recipe_id FROM like_T WHERE username=$1", [username]
    );
    const liked = arrayOfObjectsToArray(res1.rows, 'recipe_id');
    // get user's own recipes
    const res2 = await client.query(
        "SELECT recipe_id FROM recipe_T WHERE author=$1", [username]
    );
    const owned = arrayOfObjectsToArray(res2.rows, 'recipe_id');
    const other = await client.query(
        "SELECT * FROM recipe_T WHERE NOT recipe_T.recipe_id = any($1) AND NOT recipe_T.recipe_id = any($2)", [liked, owned]
    );
    // return only rows that match at least 5 preferences
    return JSON.stringify(other.rows.filter(recipe => {
        return atLeastFiveMatch(recipe.preferences.split(''), userPreferences);
    }));
}

export async function updateUser(username, profile_pic, location, pref, desc, hide_recipes, display_name) {
    const user_hide_recipes = JSON.parse(await getUserInfo(username)).hide_recipes; // user's hide recipe setting
    // build query string
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
    await client.query(str + 'hide_recipes=$1 WHERE username = $2', [hide_recipes === 'same' ? user_hide_recipes : parseInt(hide_recipes), username]);
}
//Updates the specified user's password
//updateUserPass(username: string, password: string): void
export async function updateUserPass(username, password) {
    const mc = new MC();
    const [salt, hash] = mc.hash(password);
    await client.query('UPDATE password_t SET salt=$1, pwEncrypted=$2 WHERE username=$3', [salt, hash, username]);
}
export async function existsUser(username) {
    const res = await client.query(
        "SELECT * FROM user_T WHERE username=$1", [username]
    );
    return res.rows.length > 0;
}

//Deletes the specified user and all content relating to user (except for chats and messages)
//deleteUserObj(username: string): void
export async function deleteUserObj(username) {
    // delete a user's comments
    await client.query(
        "DELETE FROM comment_T WHERE sender=$1", [username]
    );
    // delete a user's likes
    await client.query(
        "DELETE FROM like_T WHERE username=$1", [username]
    );
    // delete likes on a user's recipes
    const usersRecipes = arrayOfObjectsToArray(JSON.parse(await getMyRecipes(username)), 'recipe_id'); // recipes owned by the user
    for (let i = 0; i < usersRecipes.length; i++) {
        await client.query(
            'DELETE FROM like_T WHERE recipe_id=any($1)', [usersRecipes]
        );
    }
    // delete comments on a user's recipes
    for (let i = 0; i < usersRecipes.length; i++) {
        await client.query(
            'DELETE FROM comment_T WHERE recipe_id=any($1)', [usersRecipes]
        );
    }
    // delete user's recipes
    await client.query(
        "DELETE FROM recipe_T WHERE author=$1", [username]
    );
    // delete password
    await client.query(
        "DELETE FROM password_t WHERE username=$1", [username]
    )
    // delete user
    await client.query(
        "DELETE FROM user_T WHERE username=$1", [username]
    );
}

// [2] Recipe Functions
export async function getRandomRecipe(username) {
    const recipes = JSON.parse(await getOtherRecipes(username));
    return JSON.stringify(recipes[Math.floor(Math.random() * recipes.length)]);
}
export async function createRecipeObj(title, author, ingredients, instructions, preferences, time, pic) {
    try{
        await client.query(SQL.sqlCreateRecipe(),[title,author,pic,instructions,ingredients,preferences,time, 'Enjoy!']);
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
export var currentRecipe = 1987;
export function updateCurrentRecipe(recipeID){
    currentRecipe = recipeID;
}


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
//Makes a comment obj in the database
//createCommentObj(sender: string, recipeID: string, text: string): void
export async function createCommentObj(sender, recipeID, text) {
    await client.query(
        "INSERT INTO comment_T (sender, recipe_id, content) VALUES ($1, $2, $3);", [sender, parseInt(recipeID), text]
    );
}
//Returns comment obj information for the specified comment_id
//getCommentInfo(commentID: string): { contains comment info }
export async function getCommentInfo(commentID) {
    const res = await client.query(
        "SELECT * FROM comment_T WHERE comment_id=$1", [parseInt(commentID)]
    );
    return JSON.stringify(res.rows[0]);
}
//Updates comment obj information
//updateCommentObj(commentID: string, text: string): void
export async function updateCommentObj(commentID, text) {
    await client.query(
        "UPDATE comment_T SET content=$1 WHERE comment_T.comment_id=$2", [text, parseint(commentID)]
    );
}
//Checks if a certain comment exists
//existsComment(commentID: string): boolean
export async function existsComment(commentID) {
    const res = await client.query(
        "SELECT * FROM comment_T WHERE comment_id=$1", [parseint(commentID)]
    );
    return res.rows.length > 0;
}
//Deletes a comment obj from the database
//deleteCommentObj(commentID: string): void
export async function deleteCommentObj(commentID) {
    await client.query(
        "DELETE FROM comment_T WHERE comment_id=$1", [parseint(commentID)]
    );
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
    //check if the users already have a chat 
    const check = await client.query(
        "SELECT EXISTS (SELECT FROM chat_id WHERE sender_id=$1 AND reciever_id=$2)", [sender, reciever]
    );
    if (check){
        return JSON.stringify({Status: 'SUCCESS', sender: 'test', reciever: "Jay", time:"11:01"});
    }
    const res = await client.query(
        "INSERT INTO chat_t (sender_id, reciever_id) VALUES ($1, $2)", [sender, reciever]
    );
    return JSON.stringify({Status: 'SUCCESS', sender: 'test', reciever: "Jay", time:"11:01"});
}
export async function getChat(user) {
    const res = await client.query(
        "SELECT * FROM chat_t WHERE sender_id=$1 OR reciever_id=$1", [user]
    ); //Chat: {sender_id: int, reciever_id: int, chat_id: int}
    console.log("the chat is as follows: ", res.rows);
    return JSON.stringify(res.rows);
    return JSON.stringify([{sender: 'test', reciever: "Jay"}, {sender: 'test', reciever: "Bella"}, {sender: 'test', reciever: "Daktshh"}]);
}
export async function updateChat(sender, chatID, text){
    var today = new Date();
    await client.query(
        "INSERT INTO message_t (sender_id, chat_id, mess, time) VALUES ($1, $2, $3, $4)", [sender, chatID, text, today.getHours() + ":" + today.getMinutes()]
    );
    return {Status: "SUCCESS"};
} //added this
export function deleteChat(user, reciever){
    return {Status: "SUCCESS", reciever: reciever};
}


// [6] Message Functions
export async function getMessages(chatID) { 
    // const res = await client.query(
    //     "SELECT * FROM message_t WHERE chat_id=$1", [chatID]
    // ); //Message: {sender_id: int, chat_id: int, text: string, time: int}
    const res = await client.query(
        "SELECT message_t.sender_id, message_t.mess, message_t.time, chat_t.reciever_id FROM message_t INNER JOIN chat_t ON message_t.chat_id = chat_t.chat_id WHERE message_t.chat_id=$1", [chatID]
    ); //above didn't have chat_t.reciever_id
    console.log("here are the messages with test and jay: ", res.rows);
    return JSON.stringify(res.rows);
    // return JSON.stringify(res.rows);
    return JSON.stringify([{sender_id: 'test', reciever: "Jay", text: "Hey! I had a couple questions regarding your recipe.", time:"11:01"}, 
    {sender_id: 'Jay', reciever: "test", text: "I'd be happy to help!", time:"11:02"}, 
    {sender_id: 'test', reciever: "Jay", text: "Are there any substitues we could use for dairy?", time:"11:05"}]);
}

export async function getMessageID(sender, reciever){
    const res = await client.query(
        "SELECT chat_id FROM chat_t WHERE sender_id = $1 AND reciever_id = $2", [sender, reciever]
    );
    console.log("the chatID is: ", res.rows[0].chat_id);
    return JSON.stringify(res.rows[0].chat_id);
}