/*Lines 1-9 were from Daksh for Heroku
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
client.connect();*/


//Lines 13-26 are from Bella for local postgres
import pg from 'pg';
const {Client} = pg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Nintendo64!',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

import * as SQL from './querybuilder.js';

//EXAMPLE QUERY SHOWN BELOW:

//client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

//JAY EXAMPLE:
//const res = await client.query(
//    "INSERT INTO users (username, profile_pic, display_name, location, preferences, description) VALUES ($1, $2, $3, $4, $5, $6)", [username, 'default profile pic', displayName, '', new Array(12).fill(0), '']
//    );

// DataBase Functions, NOTE: Still returns dummy data
// Authorization
export function authUserObj(req) {
    if (req.query.email === req.query.password) {
        
        return {Status: 'SUCCESS'}
    }
    return {Status: 'ERROR'}
}

// [1] User Functions
export function createUserObj(username, password, displayName) {
    return {status: 'SUCCESS', username: username, password: password, displayName: displayName};
}

export function getUserInfo(username) {
    return JSON.stringify({username: "Jay1024", display_name: "Jay", profile_picture: "filename.jpeg", location: "Amherst", preferences: [1,0,0,0,0,0,0], description: "I like to eat food"});
}

export async function getSavedRecipes(username) {
    let res = await client.query(SQL.sqlSavedRecipes(), [username]);
    return JSON.stringify(res.rows);
}

export async function getMyRecipes(username) {
    let res = await client.query(SQL.sqlMyRecipes(), [username]);
    return JSON.stringify(res.rows);
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

/*export async function getMyRecipes(username) {
    let res = await client.query(SQL.sqlMyRecipes(), [username]);
    return JSON.stringify(res.rows);
}*/

export function existsRecipe(title, author) {
    return false;
}
export function getRecipeInfo(recipeID) {
    return JSON.stringify({recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "pizza.jpg",
    ingredients: '{"Dough": "3 pounds"}, {"Sauce": "2 gallons"}, {"Cheese" : "3 cups"}', recipeID: 197,
    instructions: ["knead dough", "spread sauce", "sprinkle cheese"], preferences: [0,1,0,0,0,0,0],
    time: "approx 90 minutes", likes:2, rating: 3.5, "ingredients_notes":"Feel free to experiment with toppings!",
    tips_and_notes: "I love pizza, and I bet you do too! Come check out my profile for more pizza recipes! I'd love to hear about your spin on my recipe!"});
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
export var currChat;
export function createChat(sender, reciever){
    currChat = reciever;
    //update GetChat when we have an actual database
    return JSON.stringify({Status: 'SUCCESS', sender: 'test', reciever: "Jay", time:"11:01"});
}
export function getChat(user){
    return JSON.stringify([{sender: 'test', reciever: "Jay"}, {sender: 'test', reciever: "Bella"}, {sender: 'test', reciever: "Daktshh"}]);
}
export function deleteChat(user, reciever){
    return {Status: "SUCCESS", reciever: reciever};
}


// [6] Message Functions
export function getMessages(sender, reciever){
    return JSON.stringify([{sender: 'test', reciever: "Jay", text: "Hey! I had a couple questions regarding your recipe.", time:"11:01"}, 
    {sender: 'Jay', reciever: "test", text: "I'd be happy to help!", time:"11:02"}, 
    {sender: 'test', reciever: "Jay", text: "Are there any substitues we could use for dairy?", time:"11:05"}]);
}