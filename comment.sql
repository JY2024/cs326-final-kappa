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