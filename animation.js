var animation;
var isPaused = false;

function doAnim() {
    
    ctx = cvns.ctx;
    ctx.globalCompositeOperation = 'destination-over'; 
    cvns.clear();

    for (let i = 0; i < objects.length; i++) {
        objects[i].collisions = [];
    }

    for (let i = 0; i < objects.length; i++) {
        objects[i].collide();
    }

    for (let i = 0; i < objects.length; i++) {
        objects[i].move();
    }

    for (let i = 0; i < objects.length; i++) {
        objects[i].draw(ctx);
    }

}
