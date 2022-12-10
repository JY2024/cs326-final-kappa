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

DROP TABLE chat_t CASCADE;
DROP TABLE message_t CASCADE;

CREATE TABLE chat_t
    (chat_id SERIAL PRIMARY KEY,
    sender_id text,
    reciever_id text);

INSERT INTO chat_t(chat_id, sender_id, reciever_id) VALUES ('129478129', 'test', 'Jay'); --used to be 129478129

INSERT INTO chat_t(chat_id, sender_id, reciever_id) VALUES ('129478130', 'test', 'Bella');

INSERT INTO chat_t(chat_id, sender_id, reciever_id) VALUES ('129478131', 'test', 'Daktshh');

CREATE TABLE message_t
    (message_id SERIAL PRIMARY KEY,
    sender_id text,
    chat_id int,
    mess text,
    "time" text);

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847192', 'test', '129478129', 'Hey! I had a couple questions regarding your recipe.', '11:01');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847193', 'Jay', '129478129', 'Id be happy to help!', '11:02');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847194', 'test', '129478129', 'Are there any substitues we could use for dairy?', '11:05');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847195', 'test', '129478130', 'Hey Daktshh.', '11:01');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847196', 'Bella', '129478130', 'Yo', '11:02');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847197', 'test', '129478130', 'How are you ?', '11:05');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847198', 'test', '129478131', 'testing 12.', '11:01');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847199', 'Daktshh', '129478131', 'This is jay', '11:02');

INSERT INTO message_t(message_id, sender_id, chat_id, mess, "time") VALUES ('1812847200', 'test', '129478131', 'sup', '11:05');