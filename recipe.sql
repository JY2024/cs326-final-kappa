DROP TABLE recipe_T;

CREATE TABLE recipe_T (
  recipe_id       SERIAL PRIMARY KEY,
  recipe_name     VARCHAR(50) NOT NULL,
  author          VARCHAR(15) NOT NULL,
  recipe_picture  BLOB NOT NULL,
  instructions    VARCHAR(500) NOT NULL,
  ingredients     JSON NOT NULL,
  preferences     VARCHAR(12) NOT NULL,
  prep_time       INT NOT NULL,
  tips_and_notes  VARCHAR(500)
);

--INSERT INTO recipe_T (recipe_id, recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
--    VALUES (1, value1, value2, value3, value4, value5, value6, value7, value8);

INSERT INTO recipe_T (id, recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES (1, 'Pizza', 'bella_chilton', 
    FILE_READ('webPages/images/pizza.jpeg'), 
    'Spread dough into 12 inch circle, spread sauce, sprinkle cheese\nPlace on baking tray\nBake at 400 degrees F for 20 minutes',
    {'Dough':'1lb','Tomato Sauce':'2 cups','Shredded Mozerella':'2 cups'},
    '100000000000', 2, 
    'Don''t burn yourself\nCut pizza into 6 pieces');