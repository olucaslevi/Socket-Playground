import React, { Component } from 'react';
import io from 'socket.io-client';
import { useState,useEffect, useRef } from 'react';

// import chat.js
import {log,onChatSubmit,onChatLeave} from "./src/Components/chat.js";
const BACKGROUND_COLOUR = "black";
const socket = io.connect("http://localhost:3000");


export function App() {

   const refCanvas = useRef();

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
   })();

   useEffect(() => {
      document
      .getElementById('chat-form')
      .addEventListener('submit', (event) => {
          event.preventDefault();
          onChatSubmit(socket);       
      });   
      if (refCanvas.current) {
         const canvas = refCanvas.current.getContext('2d');
         // change size
         canvas.width = 832;
         canvas.height = 576;
     
         // ? pinta o canvas de preto.
         canvas.fillStyle = BACKGROUND_COLOUR;
         canvas.fillRect(0,0,canvas.width, canvas.height);
       }
      return () => {
      };
         
    }, []);


   const game_loop = () => {
      // * canvas
      const canvas = document.getElementById("canvas"); 
      console.log(canvas);
   }
   game_loop();
   return (
      
      <div className="App">
         <header className="App-header">
            <h1>Game</h1>
            <div id="root">
               <canvas id="canvas" ref={refCanvas} width="832" height="576"></canvas>
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