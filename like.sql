DROP TABLE like_T CASCADE;

CREATE TABLE like_T (
  username        VARCHAR(15) NOT NULL,
  recipe_id       INT NOT NULL,
  PRIMARY KEY (username, recipe_id)
);

--INSERT INTO like_T (username, recipe_id) VALUES (value1, value2);

INSERT INTO like_T (username, recipe_id) VALUES ('jay1024', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Pizza' AND author='bellaiscool'));

INSERT INTO like_T (username, recipe_id) VALUES ('awesomeDaksh', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Pizza' AND author='bellaiscool'));

INSERT INTO like_T (username, recipe_id) VALUES ('alex1998', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Burger' AND author='bellaiscool'));

INSERT INTO like_T (username, recipe_id) VALUES ('bellaiscool', (SELECT recipe_id FROM recipe_T WHERE recipe_name='Ramen' AND author='awesomeDaksh')); 