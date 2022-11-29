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