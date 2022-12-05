const profile = document.getElementById('profile');
const feed = document.getElementById('feed');
const chat = document.getElementById("message");
const diffChat = document.getElementById('chats');
const chatBox = document.getElementById('convo');

var currUser = "Jay";
//change this using local storage later

profile.addEventListener('click', () =>{
    window.location = "/profile.html";
});
feed.addEventListener('click', () =>{
    window.location = "/main-feed.html";
});
// diffChat.addEventListener('click', (e) =>{
//     console.log("i'm here and the target of the click is: ", e);
//     console.log("i'm here and the target of the click is: ", e.target.classList[0]);
//     if(e.target.classList[0] === "person"){
//         console.log("i'm in here");
//     }
// });
chatBox.addEventListener('click', async(e) =>{
    console.log("i'm here and e.target.id is: ", e.target.id);
    console.log(e.target);
    if(e.target.id === "message" && e.target.innerText === "Send!"){
        const message = document.getElementById('comment').value;
        console.log("the message being sent is: ", message);
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
                body: "sender=test" + "&reciever=" + currUser + "&text=" + message
                // use local storage instead of test 
                // use the above with req.body.title, req.body.author. etcc
            })
            .then(async function (res) {
            if(res.ok){
                chatBox.innerHTML = '';
                console.log("the current user is: ",currUser);
                const req = new Request(fixURL(window.location.href) + '/message/view?sender=test&reciever=' + currUser, {method: 'GET'});
                const res = await fetch(req);
                console.log(res);
                if(res.ok){
                    const json = await res.json();
                    for(let i = 0; i < json.length; i++){
                        const chat = document.createElement('div');
                        const text = document.createElement('p');
                        const time = document.createElement('span');
                        const name = document.createElement('span');
                        if(json[i].sender_id === "test"){ // in the future, take this from localStorage, for now just use temp tbh
                            chat.className = "container darker";
                            text.innerText = json[i].mess;
                            text.style.textAlign = "right"; //added this
                            time.className = "time-right"; //used to be time-left
                            time.innerText = json[i].time;
                            name.className = "time-left"; //used to be time-right
                            name.innerText = "test";
                        }
                        else{
                            chat.className = "container"; //used to be container darker
                            text.innerText = json[i].mess; 
                            time.className = "time-left"; //used to be time-right
                            time.innerText = json[i].time; 
                            name.className = "time-right";
                            name.innerText = json[i].reciever_id;
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
        console.log("also just the e.target for reference is: ", e.target);
        currUser = e.target.innerText;
        chatBox.innerHTML = '';
        const req = new Request(fixURL(window.location.href) + '/message/view?sender=test&reciever=' + e.target.innerText, {method: 'GET'});
        const res = await fetch(req);
        console.log(res);
        if(res.ok){
            const json = await res.json();
            for(let i = 0; i < json.length; i++){
                const chat = document.createElement('div');
                const text = document.createElement('p');
                const time = document.createElement('span');
                const name = document.createElement('span');
                if(json[i].sender_id === "test"){ // in the future, take this from localStorage, for now just use temp tbh
                    chat.className = "container darker";
                    text.innerText = json[i].mess;
                    text.style.textAlign = "right"; //added this
                    time.className = "time-right"; //used to be time-left
                    time.innerText = json[i].time;
                    name.className = "time-left"; //used to be time-right
                    name.innerText = "test";
                }
                else{
                    chat.className = "container"; //used to be container darker
                    text.innerText = json[i].mess; 
                    time.className = "time-left"; //used to be time-right
                    time.innerText = json[i].time; 
                    name.className = "time-right";
                    name.innerText = json[i].reciever_id;
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
    const request = new Request(fixURL(window.location.href) + '/chat/list?user=test' , {method: 'GET'});
    const response = await fetch(request);
    console.log("IM IN HERE AND THE RESPONSE IS: ", response);
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
    const req = new Request(fixURL(window.location.href) + '/message/view?sender=test&reciever=Jay', {method: 'GET'});
    const res = await fetch(req);
    if(res.ok){
        const json = await res.json();
        for(let i = 0; i < json.length; i++){
            const chat = document.createElement('div');
            const text = document.createElement('p');
            const time = document.createElement('span');
            const name = document.createElement('span');
            if(json[i].sender_id === "test"){ // in the future, take this from localStorage, for now just use temp tbh
                chat.className = "container darker";
                text.innerText = json[i].mess;
                text.style.textAlign = "right"; //added this
                time.className = "time-right"; //used to be time-left
                time.innerText = json[i].time;
                name.className = "time-left"; //used to be time-right
                name.innerText = "test";
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