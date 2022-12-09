DROP TABLE recipe_T CASCADE;

CREATE TABLE recipe_T (
  recipe_id       SERIAL PRIMARY KEY,
  recipe_name     VARCHAR(50) NOT NULL,
  author          VARCHAR(15) NOT NULL,
  recipe_picture  VARCHAR(200000) NOT NULL,
  instructions    VARCHAR(500) NOT NULL,
  ingredients     VARCHAR(200) NOT NULL,--JSON NOT NULL,
  preferences     VARCHAR(12) NOT NULL,
  prep_time       INT NOT NULL,
  tips_and_notes  VARCHAR(500)
);

--INSERT INTO recipe_T (recipe_id, recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
--    VALUES (1, value1, value2, value3, value4, value5, value6, value7, value8);


INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES ('Plain ol'' Pizza', 'bellaiscool', 
    'images/pizza.jpeg', 
    'Spread dough into 12 inch circle, spread sauce, sprinkle cheese\nPlace on baking tray\nBake at 400 degrees F for 20 minutes',
    'Dough-1lb\nTomato Sauce-2 cups\nShredded Mozerella-2 cups',
    '100010000000', 2, 
    'Don''t burn yourself\nCut pizza into 6 pieces');

INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES ('Smash Burger', 'bellaiscool', 
    'images/profile-page-food6.jfif', 
    'Toast buns, seperate ground beef into 4 equally sized patties\nChop lettuce, tomatoes and onions.\nGrill burgers for 6 minutes on each side until medium well\nAssemble burgers',
    'Buns-4\nGround Beef-1lb\nOnion-1\nTomato-1\nHead of Lettuce-1\nCheddar Cheese-4 slices',
    '000000010000', 1, 
    'Serve with condiments. Melt cheese on patty.');

INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES ('Ramen', 'alex1998', 
    'images/alexramen.jpg', 
    'Toss noodles into boiling broth\nChop green onions while noodles soften\nPour noodles and broth in bowl and top with chopped onion\nOptional: Fry egg in hot pan with olive oil, add to top of ramen',
    'Vegetable Broth-2 cups\nRamen Noodles-1 bundle\nGreen Onion-1\nEgg-1(Optional)',
    '110110000000', 0, 
    'I like mine with a fried egg on top!');

INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES ('Rigatoni with Tomato Sauce', 'awesomeDaksh', 
    'images/amazinPASTA.jpg', 
    'Bring pot of water to boil and salt water, then add hard pasta.\nRoast veggies in oven at 400 degreed F for 20 minutes. Then blend with heavy cream.\nStrain pasta after 20 minutes and add to sauce.\nTop off with parmesian and herbs.',
    'Rigatoni Noodles-2 cups\nTomato-1 24oz can\nYellow Onion-1\nHeavy Cream-1/2 cup\nParmesian Cheese-3 tblspns\nItalian Herbs',
    '100010000000', 1, 
    'Add 1/2 cup of pasta water to sauce.');

INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES ('Tommy''s Bulk Up Chicken!', 'tom_is_the_bomb', 
    'images/gymbrochicken.jpg', 
    'Bring pot of water to boil and salt water, then add chicken breast.\nRemove chicken from water after 30 minutes.\nThen in a new pot, add water and rice at a 2:1 ratio.\nBoil rice for 30 minutes.',
    'White Rice-1 cup\nChicken Breast-3.5 lbs',
    '000100010000', 2, 
    'Do not add seasoning.');

INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES ('Tofu Rice Bowl', 'jess<3sanimals', 
    'images/tofubowl.jpg', 
    'Boil rice for 30 minutes until water has evaporated.\nMarinade tofu in teriyaki and soy sauce.\nChop cucumber, shred carrots.\nFry tofu in hot pan with sesame oil. Add cooked rice and stir fry for 7 minutes.\nAdd tofu and rice to bowl. Top with veggies and sesame seeds.',
    'White Rice-1 cup\nTofu-1/2 cup\nTeriyaki-As needed\nSoy Sauce-As needed\nSesame Oil-As needed\nCucumber-1/4 cup\nCarrot-1/4 cup\nSesame Seeds-1 tsp',
    '110100000010', 2, 
    'You can add any other veggies you like.');

INSERT INTO recipe_T (recipe_name, author, recipe_picture, instructions, ingredients, preferences, prep_time, tips_and_notes)
    VALUES ('Creamed Corn Casserole', 'awesomeMom27', 
    'images/corncass.jpg', 
    'Preheat oven to 350F.\nMix corn, melted butter, cheese in one large bowl.\nTransfer corn mixture into 2 quart baking dish.\nBake for 40 minutes.',
    'Creamed Corn-50oz\nUnsalted Butter-1/4 cup\nParmesian Cheese-1/4 cup\n',
    '100000000000', 2, 
    '');