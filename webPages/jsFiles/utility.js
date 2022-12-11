// fixes a url for correct usage
export function fixURL(url) {
    return url.substring(0, url.lastIndexOf('/'));
}

//Turns an array of objects into just an array of values of a specified key
//arrayOfObjectsToArray(arrOfObj: Array<Object>, key: string): Array<values of the specified key>
export function arrayOfObjectsToArray(arrOfObj, key) {
    let arr = [];
    for (const obj of arrOfObj) {
        arr.push(obj[key]);
    }
    return arr;
}

//Returns whether at least five match between the recipe and the user's preferences
//atLeastFiveMatch(recipePref: string, userPref: string): boolean
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

//Encodes an image as a base64 string
//encodeImageAsURL(element: DOM element): string
export function encodeImageAsURL(element) {
    if (element.files[0] === undefined) {
        return 'Error';
    }
    const file = element.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            resolve(reader.result);
        }
    });
}