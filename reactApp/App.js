import React, { Component } from 'react';
import io from 'socket.io-client';
import { useState,useEffect, useRef } from 'react';

import Canvas from './../reactApp/src/Components/canvas.js';

// importing class player
import Player from './../reactApp/src/Components/player.js';
// import chat.js
import {log,onChatSubmit,onChatLeave} from "./src/Components/chat.js";
const BACKGROUND_COLOUR = "black";
const CONTEXT_WIDTH = 832;
const CONTEXT_HEIGHT = 576;
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
      
      if (!currentPlayer) {
         currentPlayer = new Player(socket.id, "Player", "https://i.imgur.com/4Z0Z1XW.png", "yellow");
      }

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

      // ? pinta um negocio
      context.fillStyle = "PINK";
      context.fillRect(i*32,64,320,32);
      if (i < 25) {
         i++;
      }else if (i == 25) {
         i = 0;
      }
      // wasd movements
      (()=>{
         document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName == "w") {
               currentPlayer.vel. y = -1;
            }else if (keyName == "a") {
               currentPlayer.vel.x = -1;
            }else if (keyName == "s") {
               currentPlayer.vel.y = 1;
            }else if (keyName == "d") {
               currentPlayer.vel.x = 1;
            }
         });
         document.addEventListener('keyup', (event) => {
            const keyName = event.key;
            if (keyName == "w") {
               currentPlayer.vel.y = 0;
            }else if (keyName == "a") {
               currentPlayer.vel.x = 0;
            }else if (keyName == "s") {
               currentPlayer.vel.y = 0;
            }else if (keyName == "d") {
               currentPlayer.vel.x = 0;
            }
         });
      })();
      // draw grid with coordinates
      (()=>{
         context.strokeStyle = "white";
         context.lineWidth = 1;
         for (let i = 0; i < 832; i += GRIDSIZE) {
            context.beginPath();
            context.moveTo(i,0);
            context.lineTo(i,576);
            context.stroke();
         }
         for (let i = 0; i < 576; i += GRIDSIZE) {
            context.beginPath();
            context.moveTo(0,i);
            context.lineTo(832,i);
            context.stroke();
         }
      })();
      // draw coordenate numbers
      (()=>{
         context.fillStyle = "white";
         context.font = "bold 10px Arial";
         for (let i = 0; i < 832; i += GRIDSIZE) {
            for (let j = 0; j < 576; j += GRIDSIZE) {
               context.fillText(i/32 + "," + j/32, i + 5, j + 15);
            }
         }

      })();


      currentPlayer.draw(context);
      ////////// !  U P D A T E ///////////////
      const update = () => {
         if (currentPlayer) {
            if (currentPlayer.vel.x != 0 || currentPlayer.vel.y != 0) {
               currentPlayer.updatePosition();
               currentPlayer.draw(context);
            }
         }

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