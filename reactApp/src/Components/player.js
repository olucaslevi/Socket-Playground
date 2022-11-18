
class Player {
    // socket.id , username, 
    constructor(id, name, img, color){
        this.id = id;
        this.name = name;
        this.img = img;
        this.color = color;
        this.pos = {x: 10, y: 3};
        this.vel = {x: 0, y: 0};
    }
    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.pos.x * 32, this.pos.y * 32, 32, 32);
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
    move(dir){
        switch(dir){
            case 'Up':
                console.log('Up');
                this.vel.x = 0;
                this.vel.y = -1;
                break;
            case 'Down':
                console.log('Down');
                this.vel.x = 0;
                this.vel.y = 1;
                break;
            case 'Left':
                console.log('Left');
                this.vel.x = -1;
                this.vel.y = 0;
                break;
            case 'Right':
                console.log('Right');
                this.vel.x = 1;
                this.vel.y = 0;
                break;
        }
    }
};

export default Player;