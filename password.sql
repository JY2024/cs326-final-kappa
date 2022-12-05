DROP TABLE password_T CASCADE;

CREATE TABLE password_T (
    username        VARCHAR(15) PRIMARY KEY,
    salt            VARCHAR(32) NOT NULL,
    pwEncrypted     VARCHAR(128) NOT NULL
);

INSERT INTO password_T (username, salt, pwEncrypted)
    VALUES ('bellaiscool', '75a716b0b44d848e7100d004cc190d3d', '213af4a350ab7d04e0bdd17a8a0d17c58635d0a8c9674a4e5a921d4e59559a1854c2b9026df5238abe666a1ed208916656d70244ac20a25d64b1a7dcec94f61f');

INSERT INTO password_T (username, salt, pwEncrypted)
    VALUES ('alex1998', '3988d5db0860228df8fa22a03a0ba447', 'f24b0da2ed1ed1504c617f1ce67c26c10e1e0d7401f5ec3e242ba80c4b2cdefb2440cf8a59a8189b607f74d3318a7b26ac01dd5ba36c2e472dad10acdfe287f6');

INSERT INTO password_T (username, salt, pwEncrypted)
    VALUES ('jay1024', '30cce61a6743628c57673d20fa0e0846', '98c5d0b3e7cc9b29c36ca0304d462b10868fc6ad0f13917d84407b206583c63026fc1dd4751572256fa703bd25fcd5f7ec0f2f1108497ebaa75d846b87a8a361');

INSERT INTO password_T (username, salt, pwEncrypted)
    VALUES ('awesomeDaksh', '7c759b0de813ba702b999b47547f7107', '7a4e1f078bc7800d93d3991005c1edd3abfa77fa0026b1955e2dc107f1d0b48cf50bd7b8ff4e4d2cd369093f5910acc134cf274630e505a408a8a9119a05a8b5');