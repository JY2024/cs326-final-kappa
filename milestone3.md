# Come Look at My Food Milestone 3

## Link

Link to the website on Heroku: 

The login username is test, the password is test.

Note: When you click the green button, it takes you to the recipe page.

## Breakdon of Labor
Planning of Database Layout: Everyone

Database Implementation:

Table Implementation:
* recipe_T, user_T, like_T: Isabella
* comment_T: Jiaqi
* chat_T, message_T: Daksh

CRUD Ops:
* Recipe Object, Like Object: Isabella
* User Object, Comment Object: Jiaqi
* Chat Object, Message Object: Daksh

Back-end Functionality:
* Recipe/Like Functions: Isabella
* User/Comment Functions: Jiaqi
* Chat/Message Functions: Daksh

## Database Documentation

recipe_T:
    recipe_id       SERIAL PRIMARY KEY
    recipe_name     VARCHAR(50) NOT NULL
    author          VARCHAR(15) NOT NULL
    recipe_picture  VARCHAR(128) NOT NULL
    instructions    VARCHAR(500) NOT NULL
    ingredients     VARCHAR(100) NOT NULL
    preferences     VARCHAR(12) NOT NULL
    prep_time       INT NOT NULL
    tips_and_notes  VARCHAR(500)

recipe_T Example:
    recipe_id:       1
    recipe_name:     'Pizza'
    author:          'bellaiscool'
    recipe_picture:  'images.pizza.jpeg'
    instructions:    'Spread dough into 12 inch circle, spread sauce, sprinkle cheese\nPlace on baking tray\nBake at 400 degrees F for 20 minutes'
    ingredients:     '{"Dough":"1lb","Tomato Sauce":"2 cups","Shredded Mozerella":"2 cups"}'
    preferences:     '100000000000'
    prep_time:       2
    tips_and_notes:  'Don''t burn yourself\nCut pizza into 6 pieces'

like_T:
    username    VARCHAR(15) NOT NULL
    recipe_id   INT NOT NULL
    PRIMARY KEY (username, recipe_id)

like_T Example:
    username:   'jay1024'
    recipe_id:  1

comment_T:
    sender          VARCHAR(15)
    recipe_id       INT
    content         VARCHAR(200)
    comment_id      SERIAL PRIMARY KEY

comment_T Example:
    sender:         'jay1024'
    recipe_id:      1
    content         'Amazing recipe! Loved it :)'
    comment_id      9

user_T:
    username        VARCHAR(15) PRIMARY KEY
    profile_picture VARCHAR(128)
    display_name    VARCHAR(30) NOT NULL
    location        VARCHAR(50) NOT NULL
    preferences     VARCHAR(12) NOT NULL
    description     VARCHAR(60)
    hide_recipes    BOOLEAN NOT NULL

user_T Example:
    username        'bellaiscool'
    profile_picture 'webPages/images/profilepic.jpg'
    display_name    'Bella Chilton'
    location        'Littleton MA'
    preferences     '000000000000'
    description     'Hi, I''m Bella. I like food and I like birds.'
    hide_recipes    false

chat_T:
    chat_id         SERIAL PRIMARY KEY
    sender_id       TEXT
    reciever_id     TEXT

chat_T Example:
    chat_id         1
    sender_id       'test'
    reciever_id     'Jay'

message_T:
    message_id      SERIAL PRIMARY KEY
    sender_id       TEXT
    chat_id         INT
    mess            TEXT
    time            TEXT

message_T Example:
    message_id      1
    sender_id       1
    chat_id         1
    mess            'Hey, I had a couple questions regarding your recipe.'
    time            '11:01'
