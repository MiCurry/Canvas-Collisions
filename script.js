
class Canvas { 
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}

class Circle {
    constructor(x, y, r, dx, dy, fill, canvas) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.fill = fill; // True for fill, false for stroke
        this.canvas = canvas;
    }

    distanceFrom(circle) {
        return (this.x - circle.x) * (this.x - circle.x) + (this.y - circle.y) * (this.y - circle.y);
    }

    move() {
        if (this.x + this.r >= this.canvas.width || this.x - this.r <= 0) {
            this.dx *= -1;
        }

        if (this.y + this.r >= this.canvas.height || this.y - this.r <= 0) {
            this.dy *= -1;
        }

        this.x += this.dx;
        this.y += this.dy;

        for(let i = 0; i < objects.length; i++) {
            if (objects[i] == this) { 
                continue; 
            }
            
            let distanceSq = this.distanceFrom(objects[i]);
            let radiusSumSq = (this.r + objects[i].r) * (this.r + objects[i].r);

            if (distanceSq == radiusSumSq || distanceSq < radiusSumSq) {
                this.fill = !this.fill;
                objects[i].fill = !objects[i].fill;
            } 
        }
    }

    draw(ctx) {
        this._drawCircle(ctx, this.x, this.y, this.r, this.fill);
    }
    
    _drawCircle(ctx, x, y, r, fill) {
        let circle = new Path2D();
        circle.arc(x, y, r, 0, Math.PI * 2, true);
        if (fill == true) {
            ctx.fill(circle);
        } else {
            ctx.stroke(circle);
        }
    }
}


function doAnim() {
    ctx = cvns.ctx;
    ctx.globalCompositeOperation = 'destination-over'; 
    cvns.clear();

    for (let i = 0; i < objects.length; i++) {
        objects[i].draw(ctx);
        objects[i].move()
    }
}

function randomCircle(cvns) {
    x = Math.floor(Math.random() * (cvns.width - 0) + 0);
    y = Math.floor(Math.random() * (cvns.height - 0) + 0);
    r = Math.floor(Math.random() * (maxR - minR) + minR);
    dx = Math.floor(Math.random() * (maxDx - minDx) + minDx);
    dy = Math.floor(Math.random() * (maxDy - minDy) + minDy);
    return new Circle(x, y, r, dx, dy, false, cvns)
}

var maxDx = 10;
var minDx = 1;
var maxDy = 10;
var minDy = 1;
var maxR = 1;
var minR = 10;
var cvns;
var objects = [];

function draw() {
    cvns = new Canvas(800, 500);

    for (let i = 0; i < 30; i++) {
        objects.push(randomCircle(cvns));
    }
    setInterval(doAnim, 100)
}
