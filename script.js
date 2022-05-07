
function dot(u, v) {
    return ((u.x - (u.x + u.dx)) * (v.x - (v.x + v.dx)) + (u.y - (u.y + u.dy)) * (v. y - (v.y + v.dy)));
}

function vectorAngles(u, v) {
    return Math.acos(dot(u, v) / (u.mag() * v.mag()));
}

function nearlyEqual(a, b, esp) {
    let diff = Math.abs(a - b);
    if (diff <= esp) {
        return true;
    }
    return false;
}

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

class Object {
    constructor(m, x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.m = m; // Mass currently 1 for everything
        this.collisions = [];
    }

    mag() {
        return Math.sqrt(((this.x + this.dx) - this.x)**2 + ((this.y + this.dy) - this.y)**2)
    }

    collided(obj) {
        this.collisions.push(obj)
    }
}


class Circle extends Object {
    constructor(m, x, y, r, dx, dy, fill, canvas) {
        super(m, x, y, dx, dy)
        this.r = r;
        this.fill = fill; // True for fill, false for stroke
        this.canvas = canvas;
    }

    // Squared distance from an object
    squaredDistanceFrom(obj) {
        return (this.x - obj.x) * (this.x - obj.x) + (this.y - obj.y) * (this.y - obj.y);
    }

    doCollisions(objects) {
        for(let i = 0; i < objects.length; i++) {
            if (objects[i] == this || this.collisions.indexOf(objects[i]) != -1) { 
                continue; 
            }
            
            let distanceSq = this.squaredDistanceFrom(objects[i]);
            let radiusSumSq = (this.r + objects[i].r) * (this.r + objects[i].r);

            if (nearlyEqual(distanceSq, radiusSumSq, esp)) {
                this.fill = !this.fill;
                objects[i].fill = !objects[i].fill;

                if (this.dx == 0 && this.dy == 0 || objects[i].dx == 0 && objects[i].dy == 0) {
                    continue;
                }

                let theta = vectorAngles(this, objects[i]);

                let dxi = this.dx;
                let dyi = this.dy;
                let objDxi = objects[i].dx;
                let objDyi = objects[i].dy;

                console.log("B: this.dx: ", this.dx, "this.dy: ", this.dy);
                console.log("B: obj.dx: ", objects[i].dx, "obj.dy: ", objects[i].dy);
                
                this.dx = ((this.m - objects[i].m) / (this.m + objects[i].m)) * this.dx
                        + ((2 * objects[i].m) / (this.m + objects[i].m)) * objects[i].dx;
                this.dy = (2 * this.m) / (this.m + objects[i].m) * this.dy
                        + ((objects[i].m - this.m) / (this.m + objects[i].m)) * objects[i].dy;

                objects[i].dx = ((this.m - objects[i].m) / (this.m + objects[i].m)) * objects[i].dx
                        + ((2 * this.m) / (this.m + objects[i].m)) * dxi;
                objects[i].dy = ((2 * objects[i].m) / (this.m + objects[i].m)) * objects[i].dy
                        + ((objects[i].m - this.m) / (this.m + objects[i].m)) * dyi;


                objects[i].collided(this);
            } 
        }
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
    
        this.collisions = [];
        this.doCollisions(objects);
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
    return new Circle(1, x, y, r, dx, dy, false, cvns)
}

function randomBalls(n) {
    for (let i = 0; i < n; i++) {
        objects.push(randomCircle(cvns));
    }
}

function test2D() {
    objects.push(new Circle(1, 200, 250, 10, 5, 0, false, cvns));
    objects.push(new Circle(1, 600, 250, 10, -5, 0, false, cvns));
}

function diagnalTest() {
    objects.push(new Circle(1, 150, 150, 10, 1, 1, false, cvns));
    objects.push(new Circle(1, 250, 250, 10, -1, -1, false, cvns));
}


var esp = 10;

var maxDx = 10;
var minDx = 1;
var maxDy = 10;
var minDy = 1;
var maxR = 10;
var minR = 20;
var cvns;
var objects = [];


function draw() {
    cvns = new Canvas(800, 500);

    //randomBalls(20);
    
    //test2D();
    
    diagnalTest();


    setInterval(doAnim, 100)
}
