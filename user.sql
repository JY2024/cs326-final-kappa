DROP TABLE user_T CASCADE;

CREATE TABLE user_T (
    username        VARCHAR(15) PRIMARY KEY,
    profile_picture VARCHAR(128),
    display_name    VARCHAR(30) NOT NULL,
    "location"      VARCHAR(50) NOT NULL,
    preferences     VARCHAR(12) NOT NULL,
    "description"   VARCHAR(60),
    hide_recipes    BOOLEAN NOT NULL
);

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description", hide_recipes)
    VALUES ('bellaiscool', './images/profilepic.jpg','Bella Chilton', 'Littleton MA', '111001000001', 'Hi, I''m Bella. I like food and I like birds.', false);

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description", hide_recipes)
    VALUES ('alex1998', 'webPages/images/person.jpg','Alex Chilton', 'Boston MA', '100000000000', 'Hi, I''m Alex. I''m Bella''s brother. Birds are okay I guess.', true);

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description", hide_recipes)
    VALUES ('jay1024', NULL,'Jay Ye', 'Amherst MA', '000000000000', NULL, false);

INSERT INTO user_T (username, profile_picture, display_name, "location", preferences, "description", hide_recipes)
    VALUES ('awesomeDaksh', NULL,'Daksh Dangi', 'Amherst MA', '000000000000', NULL, false);