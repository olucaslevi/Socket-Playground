var players = []; // * list of online players

// chat
const log = (text,autor,color) =>{  // This function will be modified to do not use console.log but to use the chat box
    // document.getElementById("usernameError").innerHTML = `<span style='${color}'>**Message</span>`;
    const parent = document.getElementById("chat-list");
    const el = document.createElement('li'); // Create a <li> node num <ul>
    el.innerHTML = `<p style ='color:${color};'>${autor}: ${text}</p>`; // inserts the text into the <li> node
    parent.appendChild(el); // appends the <li> node to the <ul> node
    parent.scrollTop = parent.scrollHeight; // scrolls the chat box to the bottom
};

const onChatSubmit = (socket) =>{
    const input = document.getElementById("chat");
    console.log(input.value);
    const text = input.value;
    input.value = '';
    socket.emit('message', text);
};
const onChatLeave = (socket) =>{
    log('You left the chat');
    socket.disconnect();
};


// Login
const onLogin = (socket) => {
    const username = document.getElementById("username").value; 
    currentPlayer = new Player(0, username, {x: 4, y: 5}, "img/player.png");
    socket.emit("join", currentPlayer);
};

(() => {
    

    // chat
    const socket = io.connect("http://localhost:3000");
    // Listen for events
    socket.on("join", (data) => {
        players.push(new Player(players.length, data.name, data.pos, data.img));
        console.log(players);
        // drawPins();

    });
    
    socket.on("joined", (data) => {
        data.forEach((player, index) => {
        players.push(new Player(index, player.name, player.pos, player.img));
        console.log(player);
        });
        // drawPins();
    });

    socket.on('message', log);

    socket.on('connect', () => {
        log('You are connected');
        game_loop(socket);

    });
    socket.on('disconnect', (reason) => {
        log(`disconnect 2: ${reason}`);
    });

    socket.on("join", (data) => {
        players.push(new Player(players.length, data.name, data.pos, data.img));
        // drawPins();

      });
      
      socket.on("joined", (data) => {
        data.forEach((player, index) => {
          players.push(new Player(index, player.name, player.pos, player.img));
          console.log(player);
        });
        drawPins();
      });

    document
        .getElementById('chat-form')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            onChatSubmit(socket);       
    });
    document.getElementById('btnSair').addEventListener('click', (event) => {
        players.slice(players.indexOf(socket.id), 1);
        event.preventDefault();
        onChatLeave(socket);
    });
    document.getElementById('btnLogin').addEventListener('click', (event) => {
        event.preventDefault();
        onLogin(socket);
    });
}
)();


const BACKGROUND_COLOUR = '#231F20';
const SNAKE_COLOUR = '#C2C2C2';
const FOOD_COLOUR = '#E66916';

const gameScreen = document.getElementById("gameScreen");

let canvas, ctx;

///////////////////////////
// Game States //
///////////////////////////
const GRIDSIZE = 32;
// ? /////////////////////////////////////////////////
// ? /////////////////////////////////////////////////
// ? Classe PLAYER
// ? /////////////////////////////////////////////////
// ? /////////////////////////////////////////////////
class Player {
  constructor(id, name, x,y, img) {
    this.id = id;
    this.name = name;
    this.pos = {x: x , y: y};
    this.img = img;
  }
    updatePosition(){ // This function will be modified to update the player position
        // send the player position to the server
        console.log(players);
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // collision with walls
        
        if(this.pos.x < 0){ 
            this.pos.x = 0;
        }
        if(this.pos.x > 25){
            this.pos.x = 25;
        }
        if(this.pos.y < 0){
            this.pos.y = 0;
        }
        if(this.pos.y > 17){
            this.pos.y = 17;
        }

    }
    draw(ctx, size){ // ok
        ctx.fillStyle = "#C2C2C2";
        ctx.fillRect(this.pos.x * size, this.pos.y * size, size, size);
    }
    move(dir){
        switch(dir){
            case 'Up':
                this.vel.x = 0;
                this.vel.y = -1;
                break;
            case 'Down':
                this.vel.x = 0;
                this.vel.y = 1;
                break;
            case 'Left':
                this.vel.x = -1;
                this.vel.y = 0;
                break;
            case 'Right':
                this.vel.x = 1;
                this.vel.y = 0;
                break;
        }
    }
}
// ? /////////////////////////////////////////////////
// ? /////////////////////////////////////////////////
// ? /////////////////////////////////////////////////
// ? /////////////////////////////////////////////////
// ? /////////////////////////////////////////////////

function game_loop() {
    
    // * canvas
    const canvas = document.getElementById("canvas"); // draw the canvas
    const ctx = canvas.getContext('2d'); // aqui é onde o canvas é desenhado
    var w = document.getElementById("canvas").width;
    var h = document.getElementById("canvas").height;

    canvas.width = 832;
    canvas.height = 576;

    // ? pinta o canvas de preto.
    ctx.fillStyle = BACKGROUND_COLOUR;
    ctx.fillRect(0,0,canvas.width, canvas.height);


    const drawGrid = (size) => {
        // Grid
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += size){
            ctx.moveTo(x,0);
            ctx.lineTo(x,canvas.height);
        }
        for (let y = 0; y < canvas.height; y += size){
            ctx.moveTo(0,y);
            ctx.lineTo(canvas.width,y);
        }
        ctx.stroke();
    };
    
    
    // const drawPlayer = (player, size) => {
    //     ctx.drawImage(playerImage, player.pos.x * size, player.pos.y * size, size, size);
    // };
    const clear_screen = () => {
        ctx.fillStyle = BACKGROUND_COLOUR;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    };
    const reset_screen = () => {
        clear_screen();
        drawGrid(GRIDSIZE);
    };

    drawGrid(GRIDSIZE);


    const player = new Player(0, "Player 1", {x: 4, y: 5}, "img/player.png");
    player.draw(ctx, 32); // desenha o player na tela
    player.updatePosition(); // atualiza a posição do player

    addEventListener("keydown", (event) => {
        switch(event.key){
            case "ArrowUp":
                player.move("Up");
                break;
            case "ArrowDown":
                player.move("Down");
                break;
            case "ArrowLeft":
                player.move("Left");
                break;
            case "ArrowRight":
                player.move("Right");
                break;
        }
    });

    addEventListener('keypress', (event) => {
        if (event.key === 'w'){
            player.move('Up');
        }
        if (event.key === 's'){
            player.move('Down');
        }
        if (event.key === 'a'){
            player.move('Left');
        }
        if (event.key === 'd'){
            player.move('Right');
        }
    });
    
    addEventListener('keyup', (event) => {
        if (event.key === 'w'){
            player.vel.y = 0;
        }
        if (event.key === 's'){
            player.vel.y = 0;
        }
        if (event.key === 'a'){
            player.vel.x = 0;
        }
        if (event.key === 'd'){
            player.vel.x = 0;
        }
    });

    
    /////////////////////////////////////////
    //////////////////////////////////////
    ////////////////////////////
    //////////////////////

    function update() {
        reset_screen();
        player.draw(ctx, GRIDSIZE);
        player.updatePosition();
    }
    setInterval(update, 1000/25);
    
};

