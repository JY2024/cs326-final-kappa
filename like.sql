DROP TABLE like_T;

CREATE TABLE like_T (
  username        VARCHAR(15) NOT NULL,
  recipe_id       INT NOT NULL
  PRIMARY KEY (username, recipe_id)
);

--INSERT INTO like_T (username, recipe_id) VALUES (value1, value2);

INSERT INTO like_T (username, recipe_id) VALUES ('jay1024', 1);

INSERT INTO like_T (username, recipe_id) VALUES ('daksh', 1);