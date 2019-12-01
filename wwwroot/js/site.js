// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


function getCookie(key) {
    var cookies = document.cookie.split(';').map(c => c.trim());
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith(key + '=')) return unescape(cookies[i].slice(key.length + 1));
    }
    return '';
}
function createMessageEntry(uname,encodedName, encodedMsg) {
    var entry = document.createElement('div');
    entry.classList.add("message-entry");
    if (encodedName === "_SYSTEM_") {
        entry.innerHTML = encodedMsg;
        entry.classList.add("text-center");
        entry.classList.add("system-message");
    } else if (encodedName === "_BROADCAST_") {
        entry.classList.add("text-center");
        entry.innerHTML = `<div class="text-center broadcast-message">${encodedMsg}</div>`;
    } else if (encodedName === uname) {
        entry.innerHTML = `<div class="message-avatar pull-right">${encodedName}</div>` +
            `<div class="message-content pull-right">${encodedMsg}<div>`;
    } else {
        entry.innerHTML = `<div class="message-avatar pull-left">${encodedName}</div>` +
            `<div class="message-content pull-left">${encodedMsg}<div>`;
    }
    return entry;
}
function appendMessage(uname,encodeNmae, encodeMsg){
    var messageEntry = createMessageEntry(uname,encodeNmae,encodeMsg);
    var messageBox = document.getElementById("messages");
    messageBox.appendChild(messageEntry);
    messageBox.scrollTop = messageBox.scrollHeight;
}
function bindConnectionMessage(connection) {
    var messageCallback = function(name, message) {
        if (!message) return;
        // Html encode display name and message.
        var encodedName = name;
        var encodedMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var username = getCookie('githubchat_username');
        appendMessage(username,encodedName, encodedMsg);
    };
    // Create a function that the hub can call to broadcast messages.
    connection.on('broadcastMessage', messageCallback);
    connection.on('echo', messageCallback);
    connection.onclose((error)=>{
        if (error && error.message) {
            console.error(error.message);
        }
        var modal = document.getElementById('myModal');
        modal.classList.add('in');
        modal.style = 'display: block;';
    });
}