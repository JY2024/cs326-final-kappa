import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});
client.connect();

import * as SQL from './webPages/jsFiles/querybuilder.js';
import * as auth from './webPages/jsFiles/auth.js';
import { arrayOfObjectsToArray, atLeastFiveMatch } from './webPages/jsFiles/utility.js';
import { resources } from './webPages/jsFiles/pic-resources.js';
import * as miniCrypt from './webPages/jsFiles/miniCrypt.js';
const MC = miniCrypt.MiniCrypt;

// Authorization
export async function authUserObj(req) {
    if (req.body.username !== "") {
        let res = await client.query(SQL.sqlAuthUser(), [req.body.username]);
        if (res.rowCount !== 0) {
            let correct = auth.decrypt(req.body.password, res.rows[0].salt, res.rows[0].pwencrypted);
            if (correct) {
                return { status: 'SUCCESS' };
            }
        }
    }
    return { status: 'ERROR' }
}

// [1] User Functions
export async function createUserObj(username, password, displayName) {
    await client.query(
        "INSERT INTO user_T (username, profile_picture, display_name, location, preferences, description) VALUES ($1, $2, $3, $4, $5, $6);", [username, resources[1].default, displayName, '', '000000000000', '']
    );
    let saltHash = auth.encrypt(password);
    await client.query(
        "INSERT INTO password_T (username, salt, pwEncrypted) VALUES ($1, $2, $3);", [username, saltHash[0], saltHash[1]]
    );
    return JSON.stringify({ status: 'SUCCESS', username: username, displayName: displayName });
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

export async function updateUser(username, profile_pic, location, pref, desc, display_name) {
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
    await client.query(str.substring(0, str.length - 1) + ' WHERE username = $1', [username]);
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
    if (recipes.length === 0) {
        return JSON.stringify({ error: 'no more recipes' });
    }
    const obj = recipes[Math.floor(Math.random() * recipes.length)];
    if (recipes.length === 1) {
        obj['length'] = 1;
    }
    return JSON.stringify(obj);
}
export async function createRecipeObj(title, author, ingredients, instructions, preferences, time, pic, tips) {
    try {
        await client.query(SQL.sqlCreateRecipe(), [title, author, pic, instructions, ingredients, preferences, time, tips]);
    }
    catch (err) {
        return { status: "ERROR" };
    }
    return { status: 'SUCCESS' };
}
export async function getRecipeInfo(recipeID) {
    const res = await client.query(
        "SELECT * FROM recipe_t WHERE recipe_id=$1", [recipeID]
    );
    return JSON.stringify(res.rows[0]);
}

export async function deleteRecipeObj(recipeID) {
    // delete likes on the recipe
    await client.query(
        'DELETE FROM like_T WHERE recipe_id=$1', [recipeID]
    );
    // delete comments on the recipe
    await client.query(
        'DELETE FROM comment_T WHERE recipe_id=$1', [recipeID]
    );
    // delete the recipe
    await client.query('DELETE FROM recipe_t WHERE recipe_id=$1', [recipeID]);
    return 'Success';
}

// [3] Like Functions
export async function createLikeObj(sender, recipe_id) {
    //if user has already liked this recipe, they cannot like it again, return error.
    try {
        await client.query(SQL.sqlCreateLike(), [sender, recipe_id]);
    }
    catch (err) {
        return { status: "ERROR" };
    }
    return { status: 'SUCCESS' };
}

export async function deleteLikeObj(sender, recipe_id) {
    try {
        await client.query(SQL.sqlDeleteLike(), [sender, recipe_id]);
    }
    catch (err) {
        return { status: "ERROR" };
    }
    return { status: 'SUCCESS' };
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
export async function getCommentInfo(val) {
    const res = await client.query(
        "SELECT * FROM comment_t WHERE recipe_id=$1", [val]
    );
    return JSON.stringify(res.rows);
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

// [5] Chat Functions
export var currChat;
export async function createChat(sender, reciever) {
    currChat = reciever;
    //check if the users already have a chat 
    const check = await client.query(
        "SELECT COUNT(*) FROM chat_t WHERE sender_id=$1 AND reciever_id=$2", [sender, reciever]
        // "SELECT EXISTS (SELECT 1 from chat_t WHERE sender_id=$1 AND reciever_id=$2)", [sender, reciever]
    );
    if (check.rows[0]["count"] > 0) {
        return JSON.stringify({ Status: 'SUCCESS', sender: 'test', reciever: "Jay", time: "11:01" });
    }
    await client.query(
        "INSERT INTO chat_t (sender_id, reciever_id) VALUES ($1, $2)", [sender, reciever]
    );
}

export async function getChat(user) {
    const res = await client.query(
        "select reciever_id as reciever_id from chat_t where sender_id=$1 UNION select sender_id as reciever_id from chat_t where reciever_id=$1", [user]
    );
    return JSON.stringify(res.rows);
}

export async function updateChat(sender, chatID, text) {
    var today = new Date();
    await client.query(
        "INSERT INTO message_t (sender_id, chat_id, mess, time) VALUES ($1, $2, $3, $4)", [sender, chatID, text, today.getHours() + ":" + today.getMinutes()]
    );
    return { Status: "SUCCESS" };
}

// [6] Message Functions
export async function getMessages(chatID) {
    const res = await client.query(
        "SELECT message_t.sender_id, message_t.mess, message_t.time, chat_t.reciever_id FROM message_t INNER JOIN chat_t ON message_t.chat_id = chat_t.chat_id WHERE message_t.chat_id=$1", [chatID]
    );
    return JSON.stringify(res.rows);
}

export async function getMessageID(sender, reciever) {
    const check = await client.query(
        "SELECT COUNT(*) FROM chat_t WHERE sender_id=$1 AND reciever_id=$2", [sender, reciever]
    );
    const check2 = await client.query(
        "SELECT COUNT(*) FROM chat_t WHERE reciever_id=$1 AND sender_id=$2", [sender, reciever]
        // "select count(*) from chat_t where (sender_id = $1 and reciever_id = $2) or (sender_id = $2 and reciever_id = $1", [sender, reciever]
    );
    let val = parseInt(check.rows[0]["count"]) + parseInt(check2.rows[0]["count"])
    if (val < 1) {
        return res.status(400).send({ message: 'Invalid User!' });
    }
    const res = await client.query(
        "select chat_id from chat_t where (sender_id = $1 and reciever_id = $2) or (sender_id = $2 and reciever_id = $1)", [sender, reciever]
    );
    return JSON.stringify(res.rows[0].chat_id);
}