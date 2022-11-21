const profile = document.getElementById('profile');
const feed = document.getElementById('feed');

profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "/main-feed.html";
});

function fixURL(url) {
    return url.substring(0, url.lastIndexOf('/'));
}
async function renderChat() {
    // return {recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "filename.jpeg", ingredients: [{"dough": "3 pounds"}, {"sauce": "2 gallons"}, {"cheese" : "3 cups"}], instruction: ["knead dough", "spread sauce", "sprinkle cheese"], preferences: [0,1,0,0,0,0,0], time: "approx 90 minutes", likes:2, rating: 3.4, "ingredients_notes":"Feel free to experiment with toppings!"};
    const userList = document.getElementById('chats');
    const request = new Request(fixURL(window.location.href) + '/chat/list?user=test' , {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        // Users
        let counter = 0
        for(let i = 0; i < json.length; i++){
            const profile = document.createElement('div');
            profile.className = "row chat";
            const user = document.createElement('p');
            user.className = "person";
            user.innerText = json[i].reciever;
            profile.appendChild(user);
            userList.appendChild(profile);
            counter ++;
        }
        while(5-counter !== 0){
            const profile = document.createElement('div');
            profile.className = "row chat";
            const user = document.createElement('p');
            user.className = "person";
            user.innerText = "Start a new chat!";
            profile.appendChild(user);
            userList.appendChild(profile);
            counter++;
        }
    }
    //MESSAGES
    const chatBox = document.getElementById('convo');
    const req = new Request(fixURL(window.location.href) + '/message/view?sender=test&reciever=Jay', {method: 'GET'});
    const res = await fetch(req);
    if(res.ok){
        const json = await res.json();
        for(let i = 0; i < json.length; i++){
            const chat = document.createElement('div');
            const text = document.createElement('p');
            const time = document.createElement('span');
            if(json[i].sender === "test"){
                chat.className = "container";
                text.innerText = json[i].text;
                time.className = "time-right"
                time.innerText = json[i].time;
            }
            else{
                chat.className = "container-darker";
                text.innerText = json[i].text;
                time.className = "time-left"
                time.innerText = json[i].time;
            }
            text.appendChild(time);
            chat.appendChild(text);
            chatBox.appendChild(chat);
        }
        const label = document.createElement("Label");
        const input = document.createElement("input");
        label.htmlFor = "comment";
        label.innerHTML = "Type here:";
        input.type = "text";
        input.id = "comment";
        chatBox.appendChild(label);
        chatBox.appendChild(input);
    }
}
window.onload = renderChat;