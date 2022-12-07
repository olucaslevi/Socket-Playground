const http = require('http');
const express = require('express');
const socket = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000; // ? PORTA 3000 padrao do server
const randomColor = require('randomcolor');

// express cors
// socket.io setup
const server = http.createServer(app);
const io = socket(server);

var world = require('./Components/server-config.js');

var players = []; // * list of online players
let player; // * current player

io.on("connection", (socket) => {
    console.log("Socket connected: " + socket.id);
    // enviar sinal de update p/ outros players
    // ? connection config
    const color = randomColor(); // random color for player Chat
    var id = socket.id; // * player id
    world.addPlayer(id); // * add player to world
    console.log('new user connected: ' + id);
    var player = world.playerForId(id); // * get player from world and set to player variable
    socket.emit('createPlayer', player); // * send player data to client to create player

    socket.broadcast.emit('createOtherPlayer', player); // * send player data to other clients to create player
    socket.on('update', () => {
        console.log('atualizou',socket.id);
        socket.broadcast.emit('update', player);
        socket.emit('update', socket.id);
    });
    // ? players stuff
    socket.on('requestOldPlayers', function(){
        for (var i = 0; i < world.players.length; i++){
            if (world.players[i].playerId != id) // * if player is not the current player
                socket.emit('addOtherPlayer', world.players[i]); // * send player data to client to create player
        }

    });
    socket.on('updatePosition', function(data){
        var newData = world.updatePlayerData(data);
        socket.broadcast.emit('updatePosition', newData);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('removeOtherPlayer', player);
        world.removePlayer( player );
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
    console.log('Servidor principal rodando e ouvindo a porta ' + PORT);
  });