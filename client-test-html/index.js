var players = []; // * list of online players
let currentPlayer;

const sprite = new Image();
sprite.src = "./assets/character2.png";

const map = new Image();
map.src = "./assets/map.png"; // load img ok

const log = (text,autor,color) =>{  // This function will be modified to do not use console.log but to use the chat box
    // document.getElementById("usernameError").innerHTML = `<span style='${color}'>**Message</span>`;
    const parent = document.getElementById("chat-list");
    const el = document.createElement('li'); // Create a <li> node num <ul>
    // ! se o chat login tivesse On

    el.innerHTML = `<span style='color: ${color}'>${autor}</span> ${text}`;
    parent.appendChild(el); // appends the <li> node to the <ul> node
    parent.scrollTop = parent.scrollHeight; // scrolls the chat box to the bottom
};

const onChatSubmit = (socket) =>{
    const input = document.getElementById("chat");
    const text = input.value;
    input.value = '';
    socket.emit('message', text);
};
const onChatLeave = (socket) =>{
    log('You left the chat');
    socket.disconnect();
    socket.emit("disconnect",currentPlayer);
    // tirar player da lista players
    players.slice(players.indexOf(currentPlayer),1);
    currentPlayer = undefined;
};



// Login click event
const onLogin = (socket) => { // ok
    const username = document.getElementById("username").value; //"Teste"
    socket.emit("chatLogin", username); // init login
};

(() => {
    
    const socket = io.connect("http://localhost:3000");

    socket.on('message', log);
    socket.on('connect', () => {
        log('You are connected');
        game_loop(socket);
        socket.emit("joined"); // ? instancia joined qdo o jogo inicia
    });

    socket.on("update", (data) => {
        if (data.id === socket.id){
            currentPlayer = data;
        }
        console.log(data);
        // update the player
        for (let i = 0; i < players.length; i++){
            if (players[i].id === data.id){
                players[i] = data;
                
            }
        }
    });
    
    socket.on("join",(data)=>{ // ?  join é o evento que o servidor envia para o cliente quando um novo jogador se conecta
        players.push( new Player(data.id, data.name,"imgTest",data.pos));
        
        // add no list do front-end.
    });
    socket.on("leave",(data)=>{ // ? leave é o evento que o servidor envia para o cliente quando um jogador se desconecta
        players.splice(players.indexOf(data),1);
        // remove da lista do front-end
    });
    socket.on("joined", (data) => { // ? joined serve pra isso (DEDUZIR TODOS OS PLAYERS q nao sao o proprio)
        data.forEach((player) => {
            if (player.id !== socket.id){
                players.push( new Player(player.id,player.name,player.pos.x,player.pos.y));
            }
            // ? Cria instancias de players para cada player conectado
        });
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

class Player {
    // socket.id , username, 
    constructor(id, name, img){
        this.id = id;
        this.name = name;
        this.img = img;
        this.pos = {x: 10, y: 12};
        this.vel = {x: 0, y: 0};
    }

    updatePosition(){ // This function will be modified to update the player position
        // send the player position to the server
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

        ctx.drawImage(sprite, this.pos.x * size, this.pos.y * size - 10, 32,48);
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


function game_loop(socket) {
    
    // * canvas
    const canvas = document.getElementById("canvas"); 
    const ctx = canvas.getContext('2d'); //
    
    
    canvas.width   = 832;
    canvas.height = 576;

    // ? pinta o canvas de preto.
    ctx.fillStyle = BACKGROUND_COLOUR;
    ctx.fillRect(0,0,canvas.width, canvas.height);

    
    const drawGrid = (size) => {
        // Grid
        ctx.drawImage(map,0,0,canvas.width,canvas.height);
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += size){
            ctx.moveTo(x,0);
            ctx.lineTo(x,canvas.height);
        }
        for (let y = 0; y < canvas.height; y += size){
            ctx.moveTo(0,y);
            ctx.lineTo(canvas.width,y);
        }
        // ctx.stroke();
        
    };
    

    
    const clear_screen = () => {
        ctx.fillStyle = BACKGROUND_COLOUR;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    };
    const reset_screen = () => {
        clear_screen();
        drawGrid(GRIDSIZE);
    };

    drawGrid(GRIDSIZE);
    
    // * player 
    let currentPlayer = new Player(socket.id, "teste", "testeImg", {x: 2, y: 2}, {x: 0, y: 0});
    // ! entrou no jogo
    socket.emit("join", currentPlayer);


    addEventListener("keydown", (event) => {
        switch(event.key){
            case "ArrowUp":
                currentPlayer.move("Up");
                break;
            case "ArrowDown":
                currentPlayer.move("Down");
                break;
            case "ArrowLeft":
                currentPlayer.move("Left");
                break;
            case "ArrowRight":
                currentPlayer.move("Right");
                break;
        }
    });

    addEventListener('keypress', (event) => {
        if (event.key === 'w'){
            currentPlayer.move('Up');
        }
        if (event.key === 's'){
            currentPlayer.move('Down');
        }
        if (event.key === 'a'){
            currentPlayer.move('Left');
        }
        if (event.key === 'd'){
            currentPlayer.move('Right');
        }
    });
    
    addEventListener('keyup', (event) => {
        if (event.key === 'w'){
            currentPlayer.vel.y = 0;
        }
        if (event.key === 's'){
            currentPlayer.vel.y = 0;
        }
        if (event.key === 'a'){
            currentPlayer.vel.x = 0;
        }
        if (event.key === 'd'){
            currentPlayer.vel.x = 0;
        }
    });

    function drawPlayers(players){
        players.forEach((player) => {
            ctx.drawImage(sprite, player.pos.x * GRIDSIZE, player.pos.y * GRIDSIZE - 10, 32,48);
        });
    }

    
    /////////////////////////////////////////
    //////////////////////////////////////
    ////////////////////////////
    //////////////////////

    function update() {
        console.log(map.src);
        reset_screen();
        currentPlayer.updatePosition();
        currentPlayer.draw(ctx, GRIDSIZE);
        
        // ? send the player position to the server
        socket.emit("update", currentPlayer);
        
        for (let i = 0; i < players.length; i++){
            drawPlayers(players);
        }

    }
    setInterval(update, 1000/25);
};

