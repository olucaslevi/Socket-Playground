// ? Chatbox Stuff
const log = (text,autor,color) =>{  // This function will be modified to do not use console.log but to use the chat box
    // document.getElementById("usernameError").innerHTML = `<span style='${color}'>**Message</span>`;

    const parent = document.getElementById("chat-list");
    const el = document.createElement('li'); // Create a <li> node num <ul>
    el.innerHTML = `<span style='color: ${color}'>${autor}: </span> ${text}`;
    parent.appendChild(el); // appends the <li> node to the <ul> node
    parent.scrollTop = parent.scrollHeight; // scrolls the chat box to the bottom
};
const onChatSubmit = (socket) =>{
    const input = document.getElementById("chat");
    const text = input.value;
    const autor = "Teste";
    socket.emit('message', text,autor);
    input.value = "";
};
const onChatLeave = (socket) =>{
    log('You left the chat');
    // socket.emit("disconnect",currentPlayer);
    // // tirar player da lista players
    // players.slice(players.indexOf(currentPlayer),1);
    socket.disconnect();
};

export {log,onChatSubmit,onChatLeave};