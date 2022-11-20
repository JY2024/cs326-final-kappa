DROP TABLE recipe_T CASCADE;

CREATE TABLE recipe_T (
  recipe_id       SERIAL PRIMARY KEY,
  recipe_name     VARCHAR(50) NOT NULL,
  author          VARCHAR(15) NOT NULL,
  recipe_picture  VARCHAR(128) NOT NULL,
  instructions    VARCHAR(500) NOT NULL,
  ingredients     JSON NOT NULL,
  preferences     VARCHAR(12) NOT NULL,
  prep_time       INT NOT NULL,
  tips_and_notes  VARCHAR(500)
);

--INSERT INTO recipe_T (recipe_id, recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
--    VALUES (1, value1, value2, value3, value4, value5, value6, value7, value8);


INSERT INTO recipe_T (recipe_id, recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES (1, 'Pizza', 'bellaiscool', 
    'webPages/images/pizza.jpeg', 
    'Spread dough into 12 inch circle, spread sauce, sprinkle cheese\nPlace on baking tray\nBake at 400 degrees F for 20 minutes',
    '{"Dough":"1lb","Tomato Sauce":"2 cups","Shredded Mozerella":"2 cups"}',
    '100000000000', 2, 
    'Don''t burn yourself\nCut pizza into 6 pieces');

INSERT INTO recipe_T (recipe_id, recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES (2, 'Burger', 'bellaiscool', 
    'webPages/images/profile-page-food6.jfif', 
    'Toast buns, seperate ground beef into 4 equally sized patties\nChop lettuce, tomatoes and onions.\nGrill burgers for 6 minutes on each side until medium well',
    '{"Buns":"4","Ground Beef":"1lb","Onion":"1","Tomato":"1","Head of Lettuce":"1"}',
    '000000100000', 1, 
    'Serve with condiments and fries');

INSERT INTO recipe_T (recipe_id, recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES (3, 'Ramen', 'alex1998', 
    'webPages/images/profile-page-food3.jfif', 
    'Toss noodles into boiling broth\nChop green onions while noodles soften\nPour noodles and broth in bowl and top with chopped onion',
    '{"Chicken Broth":"2 cups","Ramen Noodles":"1 bundle","Green Onion":"1"}',
    '000000000000', 0, 
    'Enjoy hot and fresh');