
class Player {
    // socket.id , username, 
    constructor(id, username, position) {
        this.id = id;
        this.username = username;
        this.position = position;
        this.velocity = (0, 0, 0);
    }
    // draw player model
    drawPlayer() {
        // draw player model
    }
    // update player model
    update() {
        // update player position
        this.position.x = playerBody.position.x;
        this.position.y = playerBody.position.y;
        this.position.z = playerBody.position.z;
    }
    move(direction) {
        direction = direction.toLowerCase();
        // move player in direction
        switch (direction) {
            case "forward":
                playerBody.velocity.z = 10;
                break;
            case "backward":
                playerBody.velocity.z = -10;
                break;
            case "left":
                playerBody.velocity.x = -10;
                break;
            case "right":
                playerBody.velocity.x = 10;
                break;
        }
    }
};

export default Player;