DROP TABLE user_T CASCADE;

CREATE TABLE user_T (
    username        VARCHAR(15) PRIMARY KEY,
    profile_picture VARCHAR(200000),
    display_name    VARCHAR(30) NOT NULL,
    "location"      VARCHAR(50) NOT NULL,
    preferences     VARCHAR(12) NOT NULL,
    "description"   VARCHAR(60)
);

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description")
    VALUES ('bellaiscool', './images/profilepic.jpg','Bella Chilton', 'Littleton MA', '000000000000', 'Hi, I''m Bella. I like food and I like birds.');

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description")
    VALUES ('alex1998', 'webPages/images/person.jpg','Alex Chilton', 'Boston MA', '110000000000', 'Hi, I''m Alex. I''m Bella''s brother. Birds are okay I guess.');

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description")
    VALUES ('jay1024', NULL,'Jay Ye', 'Amherst MA', '000000000000', NULL);

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description")
    VALUES ('awesomeDaksh', NULL,'Daksh Dangi', 'Amherst MA', '000000000000', NULL);

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description")
    VALUES ('tom_is_the_bomb', 'webPages/images/tomprofile.jpeg','Tom Anderson', 'Tampa FL', '000001110000', 'Just a gym bro living in the basement of America (Florida)! Trying to find cool recipes to help me bulk up without hating my life.');

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description")
    VALUES ('jess<3sanimals', 'webPages/images/jessprofile.jfif','Jess Driscoll', 'Des Moines IA', '110100000001', 'Vegan, vegetarian, and animal lover. In my space time I do yoga and take care of under priviledged cows <3');

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description")
    VALUES ('awesomeMom27', 'webPages/images/momprofile.jpg','Teresa Palmer', 'Madison WI', '000000000000', 'This awesome mom cannot wait to try all kinds of new recipes. My favorite recipes are crock pot recipes, but I want to branch out.');