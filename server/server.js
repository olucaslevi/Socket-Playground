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
    console.log("New client connected", socket.id);
    const color = randomColor();
    socket.on("login", (user,position) => {
        players.push({ id: socket.id, user, color, position});
        socket.username = user;
        socket.color = color;
        console.log(players);
        socket.broadcast.emit("newPlayer", { id: socket.id, user, color, position});
    });
    // console.log("initial transport", socket.conn.transport.name); // prints "polling"
    socket.conn.once("upgrade", () => {
      // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      console.log("upgraded transport", socket.conn.transport.name); // prints "websocket"
    });
  
  
    socket.conn.on("close", (reason) => {
        // called when the connection is closed
        console.log("close", reason);

    });
    socket.on('message', (text,autor) => {
        autor = socket.username;
        io.emit('message', text,autor,color);
    });
    socket.on('disconnect', () => {
        socket.emit('message',`Socket disconnected: ${socket.id}`);
        players.splice(players.indexOf(socket.id), 1);
        console.log(players);
    });
  });


server.on('error', (err) => {
    console.error(err);
  });

server.listen(PORT, () => {
    console.log('server is ready at http://localhost:3000');
  });