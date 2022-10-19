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
};
