const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  client.connect();

//EXAMPLE QUERY SHOWN BELOW:

  //client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

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
export async function createUserObj(username, password, displayName) {
    const res = await client.query(
        "INSERT INTO users (username, profile_pic, display_name, location, preferences, description, hide_user) VALUES ($1, $2, $3, $4, $5, $6, $7)", [username, 'default profile pic', displayName, '', new Array(12).fill(0), '', false]
    );
    return JSON.stringify({status: 'SUCCESS', username: username, password: password, displayName: displayName});
}

export async function getUserInfo(username) {
    const res = await client.query(
        "SELECT * FROM users WHERE username=$1", [username]
    );
    return JSON.stringify(res.rows[0]);
}

//Turns an array of objects into just an array of values of a specified key
//arrayOfObjectsToArray(arrOfObj: Array<Object>, key: string)
function arrayOfObjectsToArray(arrOfObj, key) {
    let arr = [];
    for (const obj of arrOfObj) {
        arr.push(obj[key]);
    }
    return arr;
}

export async function getSavedRecipes(username) {
    const res1 = await client.query(
        "SELECT recipe_id FROM likes WHERE sender=$1", [username]
    );
    let recipe_ids = arrayOfObjectsToArray(res1.rows, 'recipe_id');
    const res2 = await client.query(
        "SELECT * FROM recipes LEFT JOIN likes ON (recipes.recipe_id = any($1))", [recipe_ids]
    );
    return JSON.stringify(res2.rows);
}

export async function getMyRecipes(username) {
    const res = await client.query(
        "SELECT * FROM recipes WHERE username=$1", [username]
    );
    return JSON.stringify(res.rows);
}

export async function getOtherRecipes(username) {
    //This will get full list of recipes that are not owned by or liked by the user AND match the preference of the user
    //Preferences can be gotten from user table, likes from the likes table.
    const userPreferences = JSON.parse(getUserInfo(username)).preferences;
    const res1 = await client.query(
        "SELECT recipe_id FROM likes WHERE sender=$1", [username]
    );
    const liked = arrayOfObjectsToArray(res1.rows, 'recipe_id');
    const res2 = await client.query(
        "SELECT recipe_id FROM recipes WHERE author=$1", [username]
    );
    const owned = arrayOfObjectsToArray(res2.rows, 'recipe_id');
    const res3 = await client.query(
        "SELECT * FROM recipes WHERE NOT recipes.recipe_id = any($1) AND NOT recipes.recipe_id = any($2)", [liked, owned]
    );
    return JSON.stringify(res3.rows.filter(recipe => {
        return recipe.preferences.every((element, index) => element === userPreferences[index]);
    }));
}

export async function updateName(name, username) {
    const res = await client.query(
        "UPDATE users SET display_name=$1 WHERE username=$2", [name, username]
    );
    return JSON.stringify({status: "SUCCESS", username: username});
}

export async function updateLocation(location, username) {
    const res = await client.query(
        "UPDATE users SET location=$1 WHERE username=$2", [location, username]
    );
    return JSON.stringify({status: "SUCCESS", username: username});
}

export async function updatePreferences(prefArr, username) {
    const res = await client.query(
        "UPDATE users SET preferences=$1 WHERE username=$2", [prefArr, username]
    );
    return JSON.stringify({status: "SUCCESS", username: username});
}

export async function updateDescription(username, desc) {
    const res = await client.query(
        "UPDATE users SET description=$1 WHERE users.username=$2", [desc, username]
    );
    return JSON.stringify({status: "SUCCESS", username: username});
}

export async function updateLocation(username, loc) {
    const res = await client.query(
        "UPDATE users SET location=$1 WHERE users.username=$2", [loc, username]
    );
    return JSON.stringify({status: "SUCCESS", username: username});
}

export async function updateProfilePicture(username, blob) {
    const res = await client.query(
        "UPDATE users SET profile_pic=$1 WHERE users.username=$2", [blob, username]
    );
    return JSON.stringify({status: "SUCCESS", username: username});
}

export async function updateHideRecipe(hidden, username) {
    const res = await client.query(
        "UPDATE users SET hide_recipes=$1 WHERE users.username=$2", [hidden, username]
    );
    return JSON.stringify({status: "SUCCESS", username: username});
}

export async function existsUser(username) {
    const res = await client.query(
        "SELECT * FROM users WHERE username=$1", [username]
    );
    return res.rows.length === 1;
}

export async function deleteUserObj(username) {
    // delete a user's likes
    const res1 = await client.query(
        "DELETE FROM likes WHERE sender=$1", [username]
    );
    // delete a user's comments
    const res2 = await client.query(
        "DELETE FROM comments WHERE sender=$1", [username]
    );
    // delete user's recipes
    const res3 = await client.query(
        "DELETE FROM recipes WHERE author=$1", [username]
    );
    // delete user's chats DO LATER
    // delete user's messages DO LATER
    // delete user
    const res6 = await client.query(
        "DELETE FROM users WHERE username=$1", [username]
    );
    return JSON.stringify({Status: "SUCCESS", username: username});
}

// [2] Recipe Functions
export async function getRandomRecipe(username) {
    const recipes = JSON.parse(getOtherRecipes(username));
    return JSON.stringify(recipes[Math.floor(Math.random() * recipes.length)]);
}
export function createRecipeObj(title, author, ingredients, instructions) {
    return {status: 'SUCCESS', recipe_name: 'MyPiza', recipeId: 1987};
}
export function existsRecipe(title, author) {
    return false;
}
export function getRecipeInfo(recipeID) {
    return JSON.stringify({recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "pizza.jpg",
    ingredients: [{"Dough": "3 pounds"}, {"Sauce": "2 gallons"}, {"Cheese" : "3 cups"}], recipeID: 197,
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
export function createLikeObj(sender, recipeID) {
    //if user has already liked this recipe, they cannot like it again, return error.
    return {Status: 'SUCCESS', recipeID: recipeID, likeCount:1}
}
export function deleteLikeObj(sender, recipeID) {
    return {Status: 'SUCCESS', recipeID: recipeID, likeCount:0}
}

// [4] Comment Functions
function makeID() {
    let id = Math.floor(Math.random() * 500);
    while (existsID(id)) {
        id = Math.floor(Math.random() * 500);
    }
    return id;
}
async function existsID(id) {
    const res = await client.query(
        "SELECT * FROM recipes WHERE recipe_id=$1", [id]
    );
    return res.rows.length > 0;
}
export async function createCommentObj(sender, recipeID, text) {
    const id = makeID();
    const res = await client.query(
        "INSERT INTO comments (sender, recipe_id, content, comment_id) VALUES ($1, $2, $3)", [sender, recipeID, text, id]
    );
    return JSON.stringify({Status: 'SUCCESS', comment_id: id});
}
export async function getCommentInfo(commentID) {
    const res = await client.query(
        "SELECT * FROM comments WHERE comment_id=$1", [commentID]
    );
    return JSON.stringify(res.rows[0]);
}
export async function updateCommentObj(commentID, text) {
    const res = await client.query(
        "UPDATE comments SET text=$1 WHERE comments.comment_id=$2", [text, commentID]
    );
    return JSON.stringify({status: "SUCCESS", comment_id: commentID});
}
export async function existsComment(commentID) {
    const res = await client.query(
        "SELECT * FROM comments WHERE comment_id=$1", [commentID]
    );
    return res.rows.length === 1;
}
export async function deleteCommentObj(commentID) {
    const res = await client.query(
        "DELETE FROM comments WHERE comment_id=$1", [commentID]
    );
    return JSON.stringify({Status: "SUCCESS", comment_id: commentID});
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