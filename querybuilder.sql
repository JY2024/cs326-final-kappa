
--function getMyRecipes Query
SELECT recipe_id, recipe_name, 
    (SELECT COUNT(*) FROM like_T AS l
        WHERE l.recipe_id=r.recipe_id) AS likes,
    0 AS comments, recipe_picture
    FROM recipe_T AS r    
    WHERE author='bellaiscool';

--function getSavedRecipes Query
SELECT r.recipe_id, recipe_name, author, recipe_picture
    FROM recipe_T AS r
    JOIN like_T ON r.recipe_id=like_T.recipe_id
    WHERE like_T.username='jay1024';

--function getRecipeInfo Query
SELECT r.recipe_name, author, recipe_picture, ingredients, recipe_id, instructions, preferences, prep_time,
    (SELECT COUNT(*) FROM like_T as l
        WHERE l.recipe_id=r.recipe_id) AS likes, 0 AS comments, tips_and_notes
    FROM recipe_T AS r
    WHERE recipe_ID=1;

