'use strict';

import * as MC from './miniCrypt.js';
const mc = new MC.MiniCrypt();

export function encrypt(password){
    const [salt,hash] = mc.hash(password);
    return [salt,hash];
}

export function decrypt(password, salt, hash){
    const res = mc.check(password, salt, hash);
    return res;
}