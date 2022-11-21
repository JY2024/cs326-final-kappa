CREATE TABLE comment_T (
    sender        VARCHAR(15),
    recipe_id INT,
    content    VARCHAR(200),
    comment_id SERIAL PRIMARY KEY
);