// chat
export const log = (text,autor,color) =>{  // This function will be modified to do not use console.log but to use the chat box
    // document.getElementById("usernameError").innerHTML = `<span style='${color}'>**Message</span>`;
    const parent = document.getElementById("chat-list");
    const el = document.createElement('li'); // Create a <li> node num <ul>
    el.innerHTML = `<p style ='color:${color};'>${autor}: ${text}</p>`; // inserts the text into the <li> node
    parent.appendChild(el); // appends the <li> node to the <ul> node
    parent.scrollTop = parent.scrollHeight; // scrolls the chat box to the bottom
};

export const onChatSubmit = (socket) =>{
    const input = document.getElementById("chat");
    console.log(input.value);
    const text = input.value;
    input.value = '';
    socket.emit('message', text);
};
export const onChatLeave = (socket) =>{
    log('You left the chat');
    socket.disconnect();
};
