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

var players = []; // * list of online players

// Server setup
io.on("connection", (socket) => {
    const color = randomColor();

    socket.on('listRequest', () => {
        socket.emit('playersList', players);
    });

    socket.on('login', (player) => {
        console.log('Player logged in:', player);
        players.push(player);
        socket.emit('login', player);
        socket.broadcast.emit('newPlayer', player);

        socket.on('disconnect', () => {
            console.log('Player disconnected:', player);
            players = players.filter(p => p.id !== player.id); // * remove player from list
            socket.broadcast.emit('playerDisconnected', player);
        });
    });

    socket.on('newPlayer', (name) => {
        console.log('New player:', name);
        socket.broadcast.emit('newPlayer', name);
        // check if name is valid
        // check if name is already taken
        // if valid, add to players list
        // if invalid, send error message
        // send updated players list to all clients
        if (name != "") {
            if (name.length > 3 && name.length < 10) {
                if (players.indexOf(name) == -1) {
                    players.push(name);
                    socket.emit('newPlayer', name);
                    socket.broadcast.emit('newPlayer', name);
                }else{
                    console.log("Nome já está em uso");
                }

            }else{
                console.log("Nome muito curto");
            }
        }else{
            console.log("Nome inválido");
        }
    });
    socket.on('exit', (name) => {
        socket.broadcast.emit('playerExited', name);
        // remove from players list
        // send updated players list to all clients
        if (name != "") {
            if (players.indexOf(name) != -1) {
                players.splice(players.indexOf(name), 1); // * remove player from list
                socket.emit('playerExited', name);
                console.log("Player exited:", name);
            }else{
                console.log("Nome não está em uso");
            }
        }else{
            console.log("Nome inválido");
        }
    });
    

    // socket.on("joined", () => {
    //   socket.emit("joined", players);
    // });

    // socket.on("join", (data)=>{
    //     players.push(data);
    //     io.sockets.emit("join", data);
    // });


    // socket.on("login", (usernameClient) => {
    //     socket.emit("login", usernameClient,color);
    // });

    // socket.on("update", (data) => {
    //   console.log(players);
    //     players.forEach((player) => {
    //         if (player.id === data.id) {
    //             player.pos = data.pos;
    //         }
    //     });
    //     io.sockets.emit("update", data); // * send player data to all players including the one who sent it
    // });
    

    socket.conn.on("close", (reason) => {
      players.slice(players.indexOf(socket.id), 1); // * remove player from list
      io.sockets.emit("leave", socket.id);
      socket.broadcast.emit("message", `${socket.name} has left the chat by ${reason}`);
    });

    socket.on('message', (text,autor) => {
        io.emit('message', text,autor,color);
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