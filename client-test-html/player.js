class Player {
    constructor(x,y){
        this.pos = {
            x: x,
            y: y
        };
        this.vel = {
            x: 0,
            y: 0
        };
    }
    updatePlayer(){ // This function will be modified to update the player position
        //
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
    draw(ctx, size){
        ctx.fillStyle = "#C2C2C2";
        ctx.fillRect(this.pos.x * size, this.pos.y * size, size, size);
    }
}