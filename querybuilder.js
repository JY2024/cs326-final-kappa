
//function getMyRecipes Query
export function sqlMyRecipes(){
    return "SELECT recipe_id, recipe_name, \
    (SELECT COUNT(*) FROM like_T AS l \
        WHERE l.recipe_id=r.recipe_id) AS likes, \
    0 AS comments, recipe_picture \
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
    VALUES ($1, $2,'images/cover.png', $4, $3, $5, $6, '');";
}

export function sqlCreateLike(){
    return "INSERT INTO like_T (username, recipe_id) \
    VALUES ($1, $2);";
}

export function sqlDeleteLike(){
    return "DELETE FROM like_T WHERE (username=$1 AND recipe_id=$2);";
}