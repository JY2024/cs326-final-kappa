
document.getElementById("myBtn").addEventListener("click",displayToggle)
document.getElementById("savedBtn").addEventListener("click",displayToggle)

function displayToggle(){
    if(document.getElementById("myBtn").checked){
        console.log("myRecipes was clicked");
        saveContent = document.getElementById("myRecipeCard").addClass("invisible")

    }
    else{
        console.log("savedRecipes was clicked");
        saveContent = document.getElementById("My Recipes").innerHTML;
        document.getElementById("My Recipes").innerHTML = lastContent;
    }
    console.log("You clicked a radio button");
}