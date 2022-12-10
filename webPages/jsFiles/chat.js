// import * as db from './database.js';

const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const chat = document.getElementById("message");
const diffChat = document.getElementById('chats');
const chatBox = document.getElementById('convo');

var currUser = window.localStorage.getItem('chat-user');
//change this using local storage later

profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "/main-feed.html";
});
chatBox.addEventListener('click', async(e) =>{
    if(e.target.id === "message" && e.target.innerText === "Send!"){
        const message = document.getElementById('comment').value;
        if(message === ''){
            alert('Please enter some text before trying to send a message!');
        }
        else{
            const res = fetch('/chat/update', { 
                mode: 'cors',
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    //"Content-type": "application/json; raw"
                },
                body: "sender=" + window.localStorage.getItem('username') + "&reciever=" + currUser + "&text=" + message
                // use local storage instead of test 
                // use the above with req.body.title, req.body.author. etcc
            })
            .then(async function (res) {
            if(res.ok){
                chatBox.innerHTML = '';
                const req = new Request(fixURL(window.location.href) + '/message/view?sender=' + window.localStorage.getItem('username') + '&reciever=' + currUser, {method: 'GET'});
                const res = await fetch(req);
                if(res.ok){
                    const json = await res.json();
                    for(let i = 0; i < json.length; i++){
                        const chat = document.createElement('div');
                        const text = document.createElement('p');
                        const time = document.createElement('span');
                        const name = document.createElement('span');
                        if(json[i].sender_id === window.localStorage.getItem('username')){ // in the future, take this from localStorage, for now just use temp tbh
                            chat.className = "container darker";
                            text.innerText = json[i].mess;
                            text.style.textAlign = "right"; //added this
                            time.className = "time-right"; //used to be time-left
                            time.innerText = json[i].time;
                            name.className = "time-left"; //used to be time-right
                            name.innerText = window.localStorage.getItem('username');
                        }
                        else{
                            chat.className = "container"; //used to be container darker
                            text.innerText = json[i].mess; 
                            time.className = "time-left"; //used to be time-right
                            time.innerText = json[i].time; 
                            name.className = "time-right";
                            name.innerText = json[i].sender_id; //fix this later if it breaks anything, used to be reciever_id like in the diffChat event listener
                        }
                        text.appendChild(name); //added this on
                        chat.appendChild(text);
                        chat.appendChild(time);
                        chatBox.appendChild(chat);
                    }
                    const label = document.createElement("Label");
                    const input = document.createElement("input");
                    const button = document.createElement("button");
                    label.htmlFor = "comment";
                    label.innerHTML = "Type here:";
                    input.type = "text";
                    input.id = "comment";
                    button.type = "subimt";
                    button.innerText = "Send!";
                    button.id = "message"
                    chatBox.appendChild(label);
                    chatBox.appendChild(input);
                    chatBox.appendChild(button);
                }
            }});
        }
    }
})

diffChat.addEventListener('click', async (e) =>{
    if(e.target.classList[0] === "person" && e.target.innerText !== "Start a new chat!"){
        currUser = e.target.innerText;
        chatBox.innerHTML = '';
        const req = new Request(fixURL(window.location.href) + '/message/view?sender=' + window.localStorage.getItem('username') + '&reciever=' + e.target.innerText, {method: 'GET'});
        const res = await fetch(req);
        if(res.ok){
            const json = await res.json();
            for(let i = 0; i < json.length; i++){
                const chat = document.createElement('div');
                const text = document.createElement('p');
                const time = document.createElement('span');
                const name = document.createElement('span');
                if(json[i].sender_id === window.localStorage.getItem('username')){ // in the future, take this from localStorage, for now just use temp tbh
                    chat.className = "container darker";
                    text.innerText = json[i].mess;
                    text.style.textAlign = "right"; //added this
                    time.className = "time-right"; //used to be time-left
                    time.innerText = json[i].time;
                    name.className = "time-left"; //used to be time-right
                    name.innerText = window.localStorage.getItem('username');
                }
                else{
                    chat.className = "container"; //used to be container darker
                    text.innerText = json[i].mess; 
                    time.className = "time-left"; //used to be time-right
                    time.innerText = json[i].time; 
                    name.className = "time-right";
                    name.innerText = json[i].sender_id; //fix this later if this breaks anything, used to be reciever_id
                }
                text.appendChild(name); //added this on
                chat.appendChild(text);
                chat.appendChild(time);
                chatBox.appendChild(chat);
            }
            const label = document.createElement("Label");
            const input = document.createElement("input");
            const button = document.createElement("button");
            label.htmlFor = "comment";
            label.innerHTML = "Type here:";
            input.type = "text";
            input.id = "comment";
            button.type = "subimt";
            button.innerText = "Send!";
            button.id = "message"
            chatBox.appendChild(label);
            chatBox.appendChild(input);
            chatBox.appendChild(button);
        }
    }
});


function fixURL(url) {
    return url.substring(0, url.lastIndexOf('/'));
}
async function renderChat() {
    // return {recipe_name: 'Pizza', recipe_author: "Jay", recipe_picture: "filename.jpeg", ingredients: [{"dough": "3 pounds"}, {"sauce": "2 gallons"}, {"cheese" : "3 cups"}], instruction: ["knead dough", "spread sauce", "sprinkle cheese"], preferences: [0,1,0,0,0,0,0], time: "approx 90 minutes", likes:2, rating: 3.4, "ingredients_notes":"Feel free to experiment with toppings!"};
    const userList = document.getElementById('chats');
    //     if(json.length === 0){
            const chatreq = new Request(fixURL(window.location.href) + '/chat/new?sender=' + window.localStorage.getItem('username') + '&reciever=' + currUser, {method: 'GET'}); ///chat/list?user=test
            const chatres = await fetch(chatreq);
            if(!chatres.ok){
                alert("Invalid User");
            }
        // }
    const request = new Request(fixURL(window.location.href) + '/chat/list?user=' + window.localStorage.getItem('username') , {method: 'GET'}); ///chat/list?user=test
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        // Users
        // let counter = 0
        // for(let i = 0; i < json.length; i++){ //json.length
        //     const profile = document.createElement('div');
        //     profile.className = "row chat";
        //     const user = document.createElement('p');
        //     user.className = "person";
        //     user.innerText = json[i].reciever_id; //reciever_id
        //     profile.appendChild(user);
        //     userList.appendChild(profile);
        //     counter ++;
        // }
        // while(5-counter !== 0){
        //     const profile = document.createElement('div');
        //     profile.className = "row chat";
        //     const user = document.createElement('p');
        //     user.className = "person";
        //     user.innerText = "Start a new chat!";
        //     profile.appendChild(user);
        //     userList.appendChild(profile);
        //     counter++;
        // }
    //     <div class="list-group list-group-flush">
    //         <button class="btn" id="display"><a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Profile
    // //         Display</a></button>
    //     </div>
        let counter = 0
        for(let i = 0; i < json.length; i++){ //json.length
            const profile = document.createElement('button');
            // profile.onclick = "await newChat(" + json[i].reciever_id + ")";
            profile.className = "btn chat";
            profile.id = 'chat'
            const item = document.createElement('a');
            item.className = "person list-group-item list-group-item-action list-group-item-light p-3";
            item.innerText = json[i].reciever_id;

            // profile.className = "row chat";
            // const user = document.createElement('p');
            // user.className = "person";
            // user.innerText = json[i].reciever_id; //reciever_id
            profile.appendChild(item);
            userList.appendChild(profile);
            counter ++;
        }
        while(5-counter !== 0){
            const profile = document.createElement('button');
            profile.className = "btn chat";
            const item = document.createElement('a');
            item.className = "person list-group-item list-group-item-action list-group-item-light p-3"; //added person to the start
            item.innerText = "Start a new chat!";
            profile.appendChild(item);
            userList.appendChild(profile);
            counter++;
        }





    }
    //MESSAGES
    const req = new Request(fixURL(window.location.href) + '/message/view?sender=' + window.localStorage.getItem('username') + '&reciever=' + window.localStorage.getItem('chat-user'), {method: 'GET'});
    const res = await fetch(req);
    if(res.ok){
        const json = await res.json();
        for(let i = 0; i < json.length; i++){
            const chat = document.createElement('div');
            const text = document.createElement('p');
            const time = document.createElement('span');
            const name = document.createElement('span');
            if(json[i].sender_id === window.localStorage.getItem('username')){ // in the future, take this from localStorage, for now just use temp tbh
                chat.className = "container darker";
                text.innerText = json[i].mess;
                text.style.textAlign = "right"; //added this
                time.className = "time-right"; //used to be time-left
                time.innerText = json[i].time;
                name.className = "time-left"; //used to be time-right
                name.innerText = window.localStorage.getItem('username');
            }
            else{
                chat.className = "container"; //used to be container darker
                text.innerText = json[i].mess; 
                time.className = "time-left"; //used to be time-right
                time.innerText = json[i].time; 
                name.className = "time-right";
                name.innerText = json[i].reciever_id;
            }
            // text.appendChild(time); -- use this to display the name 
            // chat.appendChild(text);
            // chatBox.appendChild(chat);
            text.appendChild(name); //added this on
            chat.appendChild(text);
            chat.appendChild(time);
            chatBox.appendChild(chat);
        }
        const label = document.createElement("label");
        const input = document.createElement("input");
        const button = document.createElement("button");
        label.htmlFor = "comment";
        label.innerHTML = "Type here:";
        input.type = "text";
        input.id = "comment";
        button.type = "subimt";
        button.innerText = "Send!";
        button.id = "message"
        chatBox.appendChild(label);
        chatBox.appendChild(input);
        chatBox.appendChild(button);
    }
    else{
        const label = document.createElement("Label");
        const input = document.createElement("input");
        const button = document.createElement("button");
        label.htmlFor = "comment";
        label.innerHTML = "Type here:";
        input.type = "text";
        input.id = "comment";
        button.type = "subimt";
        button.innerText = "Send!";
        button.id = "message"
        chatBox.appendChild(label);
        chatBox.appendChild(input);
        chatBox.appendChild(button);
    }
}
window.onload = renderChat;