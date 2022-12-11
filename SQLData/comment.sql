DROP TABLE comment_t CASCADE;

CREATE TABLE comment_T (
    sender        VARCHAR(15),
    recipe_id INT,
    content    VARCHAR(200),
    comment_id SERIAL PRIMARY KEY
);

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('bellaiscool', 59, 'This looks delicious!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('alex1998', 72, 'I learned how to make this myself. Yum!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('jay1024', 22, 'Yummy yum yum!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('awesomeDaksh', 29, 'This tastes good!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('testing', 4, 'This looks good!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('tester123', 4, 'YUMMM!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('bellaiscool', 4, 'cant wait to try this!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('Jay1024', 4, 'i love ramen too!');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('prof', 4, 'very innovative dish');

INSERT INTO comment_T (sender, recipe_id, content)
    VALUES ('amherst', 4, 'good job!');