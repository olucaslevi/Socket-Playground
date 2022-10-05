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
    // game: joining
    socket.on("join", (data) => {
      users.push(data); // add the new player to the list of players
      io.sockets.emit("join", data); // send the new player to all the other players
    });

    socket.on("joined", () => {
      socket.emit("joined", users);
    });
    
    socket.on("login", (user,position) => {
        players.push({ id: socket.id, user, color, position});
        socket.username = user;
        socket.color = color;
        console.log(players);
        socket.emit("message", `${user} has joined the chat`);
        socket.emit("newPlayer", players);
        
    });
    // console.log("initial transport", socket.conn.transport.name); // prints "polling"
    socket.conn.once("upgrade", () => {
      // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    });
  
  
    socket.conn.on("close", (reason) => {

    });
    socket.on('message', (text,autor) => {
        autor = socket.username;
        io.emit('message', text,autor,color);
    });
    
    socket.on('disconnect', () => {
        socket.emit('message',`Socket disconnected: ${socket.id}`);
        players.splice(players.indexOf(socket.id), 1);
    });
  });


server.on('error', (err) => {
    console.error(err);
  });

server.listen(PORT, () => {
    console.log('server is ready at http://localhost:3000');
  });