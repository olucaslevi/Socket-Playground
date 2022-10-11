const http = require('http');
const express = require('express');
const socket = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000;
const randomColor = require('randomcolor');

app.use(express.static(`${__dirname}/../client`));
// socket.io setup
const server = http.createServer(app);
const io = socket(server);

let players = []; // * list of online players

// Server setup
io.on("connection", (socket) => {
    const color = randomColor();

    socket.on("joined", () => {
      socket.emit("joined", players);
    });

    socket.on("join", (data)=>{
        players.push(data);
        io.sockets.emit("join", data);
    });
    
    socket.on("update", (data) => {
        players.forEach((player) => {
            if (player.id === data.id) {
                player.pos = data.pos;
            }
        });
        io.sockets.emit("update", data); // * send player data to all players including the one who sent it
    });
        
    
  
    socket.conn.on("close", (reason) => {
      players.slice(players.indexOf(socket.id), 1); // * remove player from list
      io.sockets.emit("leave", socket.id);
      socket.broadcast.emit("message", `${socket.name} has left the chat by ${reason}`);
    });

    socket.on('message', (text,autor) => {
        autor = socket.username;
        io.emit('message', text,autor,color);
    });
    socket.on("chatLogin", (username) => {
        socket.username = username;
        socket.emit("message", `You have joined the chat as ${username}`);
        socket.broadcast.emit("message", `${username} has joined the chat`);
    }); 

    socket.on("disconnect", (currentPlayer) => {
        socket.emit('message',`Socket disconnected: ${socket.id}`);
        socket.broadcast.emit('message',`Socket disconnected: ${socket.id}`);
        players.splice(players.indexOf(socket.id), 1);
        socket.emit("lefted",currentPlayer);
        io.sockets.emit("message", `${socket.username} has left the chat`);
        io.sockets.emit("lefted",currentPlayer);
    });
  });


server.on('error', (err) => {
    console.error(err);
  });

server.listen(PORT, () => {
    console.log('server is ready at http://localhost:3000');
  });