import React, { Component } from 'react';
import io from 'socket.io-client';
import { useState,useEffect, useRef } from 'react';
// importin three
import * as THREE from 'three';
// importing cannon to physics
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

// importing class player
import Player from './src/Components/player.js';
// import chat.js
import { World } from 'cannon-es';

const socket = io.connect("http://localhost:3000");

let currentPlayer;


export function App() {
   const [name, setName] = useState("");
   const [user, setUser] = useState(null);
   const [message, setMessage] = useState("");
   const [messages, setMessages] = useState([]);
   const [players, setPlayers] = useState([]);

   // ? Chatbox Stuff

   function log (text,autor,color){
      // document.getElementById("usernameError").innerHTML = `<span style='${color}'>**Message</span>`;
      const parent = document.getElementById("chat-list");
      const el = document.createElement('li'); // Create a <li> node num <ul>
      el.innerHTML = `<span style='color: ${color}'>${autor}: </span> ${text}`;
      parent.appendChild(el); // appends the <li> node to the <ul> node
      parent.scrollTop = parent.scrollHeight; // scrolls the chat box to the bottom
   }


   useEffect(() => {
      const scene = new THREE.Scene(); /// creating scene
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();

      const physicsWorld = new CANNON.World({
         gravity: new CANNON.Vec3(0, -10, 0),
         frictionGravity: 0.5,
      });

      // Create a slippery material (friction coefficient = 0.0)
      const physicsMaterial = new CANNON.Material('physics')
      const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
         friction: 0.0,
         restitution: 0.3,
      })
      // We must add the contact materials to the world
      physicsWorld.addContactMaterial(physics_physics)
      const groundBody = new CANNON.Body({
         mass: 0,
         material: physicsMaterial,
         shape: new CANNON.Plane(),
         type: CANNON.Body.STATIC
      });
      groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // * rotate the ground
      physicsWorld.addBody(groundBody);

      socket.on('message', log);
      
      const cannonDebugger = new CannonDebugger(scene, physicsWorld);
      
      socket.on('playerExited', (name) => {
         console.log(name + " saiu do jogo");
      })

      
      // * adding grid to scene
      scene.add( new THREE.GridHelper( 100, 100 ) );
      // * adding light to scene
      scene.add( new THREE.AmbientLight( 0x404040 ) );
      // *size, intensity, distance, decay
      renderer.setSize(window.innerWidth/1.3, window.innerHeight/1.3);
      document.body.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 10, 0);

      // ? duck
      let duck;
      // ? load duck
      const loader = new GLTFLoader();
      loader.load(
         'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf',
         (gltf) => {
            duck = gltf.scene;
            duck.scale.set(2, 2, 2);
            scene.add(duck);
         },
         undefined,
         (error) => {
            console.error(error);
         }
      );

      socket.on("newPlayer", (player) => {
         console.log(player.name + " entrou no jogo");
         const newPlayer = new Player(player.name, player.id, player.x, player.y, player.z, player.color, physicsWorld, physicsMaterial);
         setPlayers([...players, newPlayer]);
      });
      var playerShape = new CANNON.Box(new CANNON.Vec3(1,1,1));
      var playerBody = new CANNON.Body({
         mass: 1,
         material: physicsMaterial,
         shape: playerShape,
         type: CANNON.Body.DYNAMIC
      });
      playerBody.position.set(0, 1, 0);
      physicsWorld.addBody(playerBody);

      // wasd 
      document.addEventListener('keydown', (event) => {
         const keyName = event.key;
         if (keyName === 'w') {
            playerBody.velocity.z = -10;
         }
         if (keyName === 's') {
            playerBody.velocity.z = 10;
         }
         if (keyName === 'a') {
            playerBody.velocity.x = -10;
         }
         if (keyName === 'd') {
            playerBody.velocity.x = 10;
         }
      });
      document.addEventListener('keyup', (event) => {
         const keyName = event.key;
         if (keyName === 'w') {
            playerBody.velocity.z = 0;
         }
         if (keyName === 's') {
            playerBody.velocity.z = 0;

         }
         if (keyName === 'a') {
            playerBody.velocity.x = 0;
         }
         if (keyName === 'd') {
            playerBody.velocity.x = 0;
         }
      });
      

      // ? light
      const light2 = new THREE.DirectionalLight(0xffffff, 1);
      light2.position.set(0, 1, 0);
      scene.add(light2);

      // ? Texture from ground plane
      let planesize = 10;
      // load a texture, set wrap mode to repeat
      const texture = new THREE.TextureLoader().load( 'https://threejsfundamentals.org/threejs/resources/images/checker.png' );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      const repeats = planesize/2;
      // do not blur texture
      texture.magFilter = THREE.NearestFilter;
      texture.repeat.set( repeats, repeats );
      
      // ? Plane Ground
      const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
      // soft green collor: 0x44aa88
      const planeMaterial = new THREE.MeshBasicMaterial({map:texture, side: THREE.DoubleSide});
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -0.5;
      scene.add(plane);
      
      // ? set background soft blue: 0x44aaff
      scene.background = new THREE.Color(0x44aaff);
      
      // ? draw FPS
      const stats = new Stats();
      document.body.appendChild(stats.dom);
      
      // * camera position
      camera.position.z = 5;
      camera.position.y = 5;
      camera.position.x = 5;
      // * camera rotation
      camera.rotation.x = -0.5;
      camera.rotation.y = 0.5;
      camera.rotation.z = 0.5;
      // * camera lookAt
      camera.lookAt(0,0,0);
      // * camera update
      camera.updateProjectionMatrix();
      
      camera.position.z = 18;
      camera. position.y = 10;
      // camera rotation
      camera.rotation.z = 50;

      // show x,y,z lines in scene
      const axesHelper = new THREE.AxesHelper( 50 );
      scene.add( axesHelper );

      const update = () => {
         // * update camera
         camera.updateProjectionMatrix();
         // * update controls
         controls.update();
         // * update stats
         stats.update();
         // * update cannonDebugger
         cannonDebugger.update();
         // * update physicsWorld
         physicsWorld.step(1/60);
         // * update duck
         if (duck) {
            duck.position.copy(playerBody.position);
            duck.quaternion.copy(playerBody.quaternion);
         }
      };
      const animate = () => {
         update();
         physicsWorld.fixedStep();
         requestAnimationFrame(animate);
         renderer.render(scene, camera);
         // // add duck to sphere
         socket.emit('listRequest');
         // update all players   
      }
      animate();

    }, []);


   function handleChange(event) {
      setName(event.target.value);
      console.log(name);
   }


   function handleClick() {
      if (name != "") {
         if (name.length > 3 && name.length < 10) {
            socket.emit('newPlayer', name);
            document.getElementById("username").style.display = "none";
         }else{
            alert("Nome muito curto");
         }
      }else{
         alert("Nome inválido");
      }
   }
   function handleExit() {
      socket.emit('exit', name);
   }
   function handleMessageChange(event) {
      setMessage(event.target.value);
   }
   function handleSendMessage(e) {
      e.preventDefault();
      socket.emit('message', message, name);
      // set value to empty
      console.log(message)
      document.getElementById("chat").value = "";  
   }
   
   
   return (
      
      <div className="App">
         <header className="App-header" z-index="15000   ">
            <h1>Game</h1>
            
            <div>
               <label>Digite um nome </label><br/>
               <input id="username" type='text' maxLength={12} placeholder='username' onChange={handleChange}></input><br/>
               <button type='submit' onClick={handleClick}>Fazer Login</button>
            </div>
            <div id="root">
               <div id="chat-div">
                    <ul id="chat-list"></ul>
                    <form id="chat-form">
                        <input type="text" id="chat" autoComplete="off" onChange={handleMessageChange}/>
                        <button type="click" id="submit" onClick={handleSendMessage}>Send</button>
                        <button type="submit" id="btnSair" onClick={handleExit} >Sair</button>
                    </form>
                </div>
            </div>
         </header>
      </div>
      
   );
}
export default App; 