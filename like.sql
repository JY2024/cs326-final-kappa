DROP TABLE like_T CASCADE;

CREATE TABLE like_T (
  username        VARCHAR(15) NOT NULL,
  recipe_id       INT NOT NULL,
  PRIMARY KEY (username, recipe_id)
);

--INSERT INTO like_T (username, recipe_id) VALUES (value1, value2);

INSERT INTO like_T (username, recipe_id) VALUES ('bellaiscool', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Ramen' AND author='alex1998'));

INSERT INTO like_T (username, recipe_id) VALUES ('bellaiscool', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Rigatoni with Tomato Sauce' AND author='awesomeDaksh'));

INSERT INTO like_T (username, recipe_id) VALUES ('bellaiscool', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Tofu Rice Bowl' AND author='jess<3sanimals'));

INSERT INTO like_T (username, recipe_id) VALUES ('alex1998', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Tofu Rice Bowl' AND author='jess<3sanimals'));

INSERT INTO like_T (username, recipe_id) VALUES ('jay1024', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Plain ol'' Pizza' AND author='bellaiscool'));

INSERT INTO like_T (username, recipe_id) VALUES ('jay1024', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Smash Burger' AND author='bellaiscool'));

INSERT INTO like_T (username, recipe_id) VALUES ('awesomeDaksh', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Plain ol'' Pizza' AND author='bellaiscool'));

INSERT INTO like_T (username, recipe_id) VALUES ('awesomeDaksh', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Smash Burger' AND author='bellaiscool'));

INSERT INTO like_T (username, recipe_id) VALUES ('tom_is_the_bomb', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Ramen' AND author='alex1998'));

INSERT INTO like_T (username, recipe_id) VALUES ('tom_is_the_bomb', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Creamed Corn Casserole' AND author='awesomeMom27'));

INSERT INTO like_T (username, recipe_id) VALUES ('jess<3sanimals', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Ramen' AND author='alex1998'));

INSERT INTO like_T (username, recipe_id) VALUES ('awesomeMom27', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Tommy''s Bulk Up Chicken!' AND author='tom_is_the_bomb'));