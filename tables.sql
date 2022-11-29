-- USER
-- DROP TABLE USERS

-- CREATE TABLE users
--     (username text,
--     display_name text,
--     display_pic bytea,
--     location text,
--     description text,
--     preferences integer[]);

-- CREATE TABLE recipes
--     (recipe_name text,
--     author integer,
--     recipe_pic bytea,
--     recipe_id integer,
--     instructions text[],
--     ingredients text[],
--     preferences integer[],
--     num_likes integer,
--     time text,
--     tips_and_notes text);

-- CREATE TABLE comments
--     (sender text,
--     recipe_id integer,
--     comment_id integer,
--     content text);

-- CREATE TABLE likes 
--     (sender text,
--     recipe_id integer);

DROP TABLE chat_T CASCADE;
DROP TABLE message_T CASCADE;

CREATE TABLE chat_T
    (chat_id SERIAL PRIMARY KEY,
    sender_id text,
    reciever_id text);

INSERT INTO chat_T(chat_id, sender_id, reciever_id) VALUES ('129478129', 'test', 'Jay');

INSERT INTO chat_T(chat_id, sender_id, reciever_id) VALUES ('129478128', 'test', 'Bella');

INSERT INTO chat_T(chat_id, sender_id, reciever_id) VALUES ('129478127', 'test', 'Daktshh');

CREATE TABLE message_T
    (message_id SERIAL PRIMARY KEY,
    sender_id text,
    chat_id int,
    mess text,
    "time" text);

INSERT INTO message_T(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847192', '129478129', '129478129', 'Hey! I had a couple questions regarding your recipe.', '11:01');

INSERT INTO message_T(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847193', '129478128', '129478129', 'Id be happy to help!', '11:02');

INSERT INTO message_T(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847194', '129478129', '129478129', 'Are there any substitues we could use for dairy?', '11:05');