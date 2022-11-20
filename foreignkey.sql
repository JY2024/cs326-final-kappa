ALTER TABLE like_T DROP CONSTRAINT like_recipe;
ALTER TABLE like_T DROP CONSTRAINT like_user;

ALTER TABLE recipe_T DROP CONSTRAINT recipe_user;

ALTER TABLE like_T ADD CONSTRAINT like_recipe FOREIGN KEY(recipe_id) REFERENCES recipe_T(recipe_id);
ALTER TABLE like_T ADD CONSTRAINT like_user FOREIGN KEY(username) REFERENCES user_T(username);

ALTER TABLE recipe_T ADD CONSTRAINT recipe_user FOREIGN KEY(author) REFERENCES user_T(username);
