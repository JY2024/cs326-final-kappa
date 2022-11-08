// DataBase Functions
// User
export function createUserObj(username, password, displayName) {
    console.log("'" + username + "' is added to the database");
    if (username == 'Bella') {
        return {Status: 'ERROR', Username: username, errMessage: "Username '" + username + "' already exists"}
    }
    return {Status: 'SUCCESS', Username: username}
}

// Recipe
export function createRecipeObj(title, author, ingredients, instructions) {
    console.log("'" + title + ":" + author + ":" + ingredients + ":" + instructions + "'");
    if (title == 'Pizza' && author == "Bella") {
        console.log("in here");
        return {Status: 'ERROR', Recipename: 'MyPiza', errMessage: "Recipename '" + title + "' already exists with id " + 1987}
    }
    return {Status: 'SUCCESS', Recipename: 'MyPiza', recipeId: '1987'}
}

export function authUserObj(req) {
    console.log("the email is: ", req.query.email, "and the pwd is: ", req.query.password);
    if (req.query.email !== 'test' || req.query.password !== "test") {
        console.log("in here");
        return {Status: 'ERROR'}
    }
    return {Status: 'SUCCESS'}
}