export function fixURL(url) {
    return url.substring(0, url.lastIndexOf('/'));
}

//Turns an array of objects into just an array of values of a specified key
//arrayOfObjectsToArray(arrOfObj: Array<Object>, key: string)
export function arrayOfObjectsToArray(arrOfObj, key) {
    let arr = [];
    for (const obj of arrOfObj) {
        arr.push(obj[key]);
    }
    return arr;
}

export function atLeastFiveMatch(recipePref, userPref) {
    let match = 0;
    for (let i = 0; i < 12; i++) {
        if (userPref[i] === recipePref[i]) {
            match++;
        }
        if (match === 5) {
            return true;
        }
    }
    return false;
}

export function encodeImageAsURL(element) {
    const file = element.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            resolve(reader.result);
        }
    });
}