import { fixURL } from './utility.js';

const diffChat = document.getElementById('chats');
const chatBox = document.getElementById('convo');

let currUser = window.localStorage.getItem('chat-user');
//post a chat message
chatBox.addEventListener('click', async (e) => {
    if (e.target.id === "message" && e.target.innerText === "Send!") {
        const message = document.getElementById('comment').value;
        if (message === '') {
            alert('Please enter some text before trying to send a message!');
        }
        else {
            const res = fetch('/chat/update', {
                mode: 'cors',
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: "sender=" + window.localStorage.getItem('username') + "&reciever=" + currUser + "&text=" + message
            })
                .then(async function (res) {
                    if (res.ok) {
                        chatBox.innerHTML = '';
                        const req = new Request(fixURL(window.location.href) + '/message/view?sender=' + window.localStorage.getItem('username') + '&reciever=' + currUser, { method: 'GET' });
                        const res = await fetch(req);
                        if (res.ok) {
                            // render chat message
                            const json = await res.json();
                            for (let i = 0; i < json.length; i++) {
                                const chat = document.createElement('div');
                                const text = document.createElement('p');
                                const time = document.createElement('span');
                                const name = document.createElement('span');
                                if (json[i].sender_id === window.localStorage.getItem('username')) {
                                    chat.className = "container darker";
                                    text.innerText = json[i].mess;
                                    text.style.textAlign = "right";
                                    time.className = "time-right";
                                    time.innerText = json[i].time;
                                    name.className = "time-left";
                                    name.innerText = window.localStorage.getItem('username');
                                }
                                else {
                                    chat.className = "container";
                                    text.innerText = json[i].mess;
                                    time.className = "time-left";
                                    time.innerText = json[i].time;
                                    name.className = "time-right";
                                    name.innerText = json[i].sender_id;
                                }
                                text.appendChild(name);
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
        }
    }
})

diffChat.addEventListener('click', async (e) => {
    if (e.target.classList[0] === "person" && e.target.innerText !== "Start a new chat!") {
        currUser = e.target.innerText;
        chatBox.innerHTML = '';
        const req = new Request(fixURL(window.location.href) + '/message/view?sender=' + window.localStorage.getItem('username') + '&reciever=' + e.target.innerText, { method: 'GET' });
        const res = await fetch(req);
        if (res.ok) {
            const json = await res.json();
            // render chat message
            for (let i = 0; i < json.length; i++) {
                const chat = document.createElement('div');
                const text = document.createElement('p');
                const time = document.createElement('span');
                const name = document.createElement('span');
                if (json[i].sender_id === window.localStorage.getItem('username')) {
                    chat.className = "container darker";
                    text.innerText = json[i].mess;
                    text.style.textAlign = "right";
                    time.className = "time-right";
                    time.innerText = json[i].time;
                    name.className = "time-left";
                    name.innerText = window.localStorage.getItem('username');
                }
                else {
                    chat.className = "container";
                    text.innerText = json[i].mess;
                    time.className = "time-left";
                    time.innerText = json[i].time;
                    name.className = "time-right";
                    name.innerText = json[i].sender_id;
                }
                text.appendChild(name);
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

async function renderChat() {
    const userList = document.getElementById('chats');
    const chatreq = new Request(fixURL(window.location.href) + '/chat/new?sender=' + window.localStorage.getItem('username') + '&reciever=' + currUser, { method: 'GET' }); ///chat/list?user=test
    const chatres = await fetch(chatreq);
    if (!chatres.ok) {
        alert("Invalid User");
    }
    const request = new Request(fixURL(window.location.href) + '/chat/list?user=' + window.localStorage.getItem('username'), { method: 'GET' }); ///chat/list?user=test
    const response = await fetch(request);
    if (response.ok) {
        const json = await response.json();
        let counter = 0
        for (let i = 0; i < json.length; i++) {
            const profile = document.createElement('button');
            profile.className = "btn chat";
            profile.id = 'chat'
            const item = document.createElement('a');
            item.className = "person list-group-item list-group-item-action list-group-item-light p-3";
            item.innerText = json[i].reciever_id;
            profile.appendChild(item);
            userList.appendChild(profile);
            counter++;
        }
        while (5 - counter !== 0) {
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
    const req = new Request(fixURL(window.location.href) + '/message/view?sender=' + window.localStorage.getItem('username') + '&reciever=' + window.localStorage.getItem('chat-user'), { method: 'GET' });
    const res = await fetch(req);
    if (res.ok) {
        const json = await res.json();
        for (let i = 0; i < json.length; i++) {
            const chat = document.createElement('div');
            const text = document.createElement('p');
            const time = document.createElement('span');
            const name = document.createElement('span');
            if (json[i].sender_id === window.localStorage.getItem('username')) {
                chat.className = "container darker";
                text.innerText = json[i].mess;
                text.style.textAlign = "right";
                time.className = "time-right";
                time.innerText = json[i].time;
                name.className = "time-left";
                name.innerText = window.localStorage.getItem('username');
            }
            else {
                chat.className = "container";
                text.innerText = json[i].mess;
                time.className = "time-left"; 
                time.innerText = json[i].time;
                name.className = "time-right";
                name.innerText = json[i].reciever_id;
            }
            text.appendChild(name);
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
    else {
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