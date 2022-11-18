import React, { Component } from 'react';
import io from 'socket.io-client';
import { useState,useEffect, useRef } from 'react';

import Canvas from './../reactApp/src/Components/canvas.js';

// importing class player
import Player from './../reactApp/src/Components/player.js';
// import chat.js
import {log,onChatSubmit,onChatLeave} from "./src/Components/chat.js";
const BACKGROUND_COLOUR = "black";

const socket = io.connect("http://localhost:3000");

const GRIDSIZE = 32;
let currentPlayer;

// ! time stuff

const fps = 60;
const cycleDelay = Math.floor(1000/fps); // * 1000ms / 60fps = 16.666666666666668ms
var startTime = 0;
var oldCycleTime = 0
var cycleCount = 0;
var fps_rate = "carregando...";

var i = 0;

// const game_loop = (context, player) => {
//    player = new Player(0, "Player", "https://i.imgur.com/4Z0Z1XW.png", "red");
//    console.log(context,player);
//    context.fillStyle = BACKGROUND_COLOUR;
//    context.fillRect(0, 0, 832,576);
//  };
export function App() {

   // Chat Stuff import
   (()=>{
      socket.on('message', log);
      socket.on('connect', () => {
         log('You have connected to the chat');
         socketPlayer = new Player(socket.id, "Player", "https://i.imgur.com/4Z0Z1XW.png", "blue");
      });
      socket.on('disconnect', () => {
         log('You have been disconnected');
      });
      socket.on('reconnect', () => {
         log('You have reconnected to the chat');
      });
      socket.on('reconnect_error', () => {
         log('Attempt to reconnect has failed');
      });
      socket.on('pong', () => {
         log('pongou');
      });
   })();

   useEffect(() => {
      document
      .getElementById('chat-form')
      .addEventListener('submit', (event) => {
          event.preventDefault();
          onChatSubmit(socket);       
      });
      return () => {
      };
         
    }, []);

   const game_loop = (context , currentPlayer) => {
      
      currentPlayer = new Player(socket.id, "Player", "https://i.imgur.com/4Z0Z1XW.png", "yellow");
      currentPlayer.draw(context);

      currentPlayer.move("Up");

      context.width = 832;
      context.height = 576;
      // ! time stuff
      cycleCount ++;
      if (cycleCount > 60) {
         cycleCount = 0;
      }
      var startTime = new Date().getTime();
      var cycleTime = startTime - oldCycleTime;
      oldCycleTime = startTime;
      if (cycleCount % 60 == 0) {
         fps_rate = Math.floor(1000/cycleTime);
      }
      // ? pinta o context de preto.
      context.fillStyle = "black";
      context.fillRect(0,0,832,576);

      // draw fps in the top left corner
      context.fillStyle = "white";
      context.font = "bold 20px Arial";
      context.fillText("FPS: " + fps_rate, 20, 40);
      
      const drawGrid = (size) => {
         context.beginPath();
         for (let x = 0; x < context.width; x += size){
            context.moveTo(x,0);
            context.lineTo(x,context.height);
         }
         for (let y = 0; y < context.height; y += size){
            context.moveTo(0,y);
            context.lineTo(context.width,y);
         }
         context.stroke()

      };

      const clear_screen = () => {
         context.fillStyle = 'red';
         context.fillRect(0,0,context.width, context.height);
      };
      const reset_screen = () => {
         clear_screen();
      };
      // const drawPlayer = () => {
      //    context.fillStyle = "red";
      //    context.fillRect(currentPlayer.pos.x * GRIDSIZE, currentPlayer.pos.y * GRIDSIZE, GRIDSIZE, GRIDSIZE);
      // };

      context.fillStyle = "green";
      context.fillRect(i*32,64,320,32);
      if (i < 25) {
         i++;
      }else if (i == 25) {
         i = 0;
      }
      ////////// !  U P D A T E ///////////////
      const update = () => {
         currentPlayer.updatePosition();
         currentPlayer.draw(context, GRIDSIZE);
         console.log(currentPlayer,':',currentPlayer.pos.x,currentPlayer.pos.y);

      };
      update();

      setTimeout(() => {
         requestAnimationFrame(() => game_loop(context, currentPlayer));
      }, 1000 / 60);

   };
   function handleClick() {
      socket.emit('ping');
   }
   
   return (
      
      <div className="App">
         <header className="App-header">
            <h1>Game</h1>
            <div id="root">
               <button type="click" onClick={handleClick}>Ping</button>
               <Canvas draw={game_loop} height={576} width={832} />
               {/* <canvas id="canvas" ref={canvasRef} width="832" height="576"></canvas> */}
               <div id="chat-div">
                    <ul id="chat-list"></ul>
                    <form id="chat-form">
                        <input type="text" id="chat" autoComplete="off"/>
                        <button type="submit" id="submit">Send</button>
                        <button type="button" id="btnSair" >Sair</button>
                    </form>
                </div>
            </div> 
         </header>
      </div>
   );
}
export default App;  