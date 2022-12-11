
//function getMyRecipes Query
//FOR RECIPES
export function sqlMyRecipes(){
    return "SELECT recipe_id, recipe_name, \
    (SELECT COUNT(*) FROM like_T AS l \
        WHERE l.recipe_id=r.recipe_id) AS likes, \
    (SELECT COUNT(*) FROM comment_T AS c \
        WHERE c.recipe_id=r.recipe_id) AS comments, \
    recipe_picture \
    FROM recipe_T AS r \
    WHERE author=$1;";
}

export function sqlSavedRecipes(){
    return "SELECT r.recipe_id, recipe_name, author, recipe_picture \
    FROM recipe_T AS r \
    JOIN like_T ON r.recipe_id=like_T.recipe_id \
    WHERE like_T.username=$1;"
}

export function sqlCreateRecipe(){
    return "INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";
}

export function sqlCreateLike(){
    return "INSERT INTO like_T (username, recipe_id) \
    VALUES ($1, $2);";
}

export function sqlDeleteLike(){
    return "DELETE FROM like_T WHERE (username=$1 AND recipe_id=$2);";
}

//FOR USERS
export function sqlSelectUser(){
    return "SELECT username FROM user_T WHERE username=$1;";
}

//USER AUTH
export function sqlAuthUser(){
    return "SELECT salt, pwEncrypted FROM password_T WHERE username=$1;";
}