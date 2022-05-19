
var animation;
var isPaused = false;

document.onkeypress = function(p) {
    p = p || window.event;
    pause();
};

function pause() {
    if (!isPaused) {
        clearInterval(animation)
        isPaused = true;
    }  else {
        animation = setInterval(doAnim, time);
        isPaused = false;
    }
}

function dot(u, v) {
    return ((u.x - (u.x + u.dx)) * (v.x - (v.x + v.dx)) + (u.y - (u.y + u.dy)) * (v. y - (v.y + v.dy)));
}

function dot2(u, v){
    return u.dx * v.dx + u.dy * v.dy;
}

function vectorAngles2(u, d, uMag, vMag) {
    var dots = dot2(u,d,uMag,vMag);
    var mags = uMag * vMag;
    return  Math.acos(dot2(u, d) / (uMag * vMag));
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

    hasCollided(obj) {
        if (this.collisions.indexOf(obj) == -1) {
            return false;
        }
        return true;
    }
}


function redirect(v, theta) {
        var dx = 0;
        var dy = 0;
        dx = v.dx * Math.cos(2*theta) + v.dy * Math.sin(2*theta);
        dy = v.dx * Math.sin(2*theta) + - v.dy * -Math.cos(2*theta);
        v.dx = dx;
        v.dy = dy;
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
        return (this.x - obj.x)**2  + (this.y - obj.y)**2 ;
    }

    xDistanceFrom(obj) {
        return this.x - obj.x
    }

    yDistanceFrom(obj) {
        return this.y - obj.y
    }

    incedentAngle(v) {
        var dx = this.xDistanceFrom(v)
        var dy = this.yDistanceFrom(v)
        var distanceVector = { dx : dx,
                               dy : dy,
                               mag : Math.sqrt(dx**2 + dy**2) }
        return vectorAngles2(this, distanceVector, this.mag(), distanceVector.mag)
    }

    doCollisions(objects) {
        for(let i = 0; i < objects.length; i++) {
            if (objects[i] == this) { 
                continue; 
            }
            
            let distanceSq = this.squaredDistanceFrom(objects[i]);
            let radiusSumSq = (this.r + objects[i].r) * (this.r + objects[i].r);

	    if (distanceSq <= radiusSumSq + esp && !this.hasCollided(objects[i])) {
                console.log("COLLISION");
                // let theta = vectorAngles(this, objects[i]);
		        let theta = this.incedentAngle(objects[i], distanceSq);

                console.log("Theta:", theta);
                console.log("A1: ", this.dx, this.dy)
                console.log("A2: ", objects[i].dx, objects[i].dy)
                
                redirect(this, theta);
                redirect(objects[i], theta);

                console.log("B1: ", this.dx, this.dy)
                console.log("B2: ", objects[i].dx, objects[i].dy)

                this.collided(objects[i]);
                objects[i].collided(this);
                pause();
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

    }

    collide(){
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

function test2DHoriz() {
    objects.push(new Circle(1, 200, 250, 10, 5, 0, false, cvns));
    objects.push(new Circle(1, 600, 250, 10, -5, 0, false, cvns));
}

function test2DVert() {
    objects.push(new Circle(1, 200, 150, 10, 0, 5, false, cvns));
    objects.push(new Circle(1, 200, 250, 10, 0, -5, false, cvns));
}

function testGlanceVert() {
    objects.push(new Circle(1, 210, 150, 10, 0, 5, false, cvns));
    objects.push(new Circle(1, 200, 250, 10, 0, -5, true, cvns));
}

function testGlanceHoriz() {
    objects.push(new Circle(1, 250, 260, 10, -5, 0, false, cvns));
    objects.push(new Circle(1, 200, 250, 10, 5, 0, true, cvns));
}

function diagnalTest() {
    objects.push(new Circle(1, 150, 150, 10, 1, 1, false, cvns));
    objects.push(new Circle(1, 250, 250, 10, -1, -1, true, cvns));
}

function testGlanceDiag() {
    objects.push(new Circle(1, 150, 150, 10, 10, 10, false, cvns));
    objects.push(new Circle(1, 250, 260, 10, -10, -10, true, cvns));
}

function sameDirection() {
    objects.push(new Circle(1, 150, 150, 10, 5, 0, false, cvns));
    objects.push(new Circle(1, 200, 150, 10, 1, 0, true, cvns));
}


var esp = 50;

var maxDx = 10;
var minDx = 1;
var maxDy = 10;
var minDy = 1;
var maxR = 10;
var minR = 20;
var cvns;
var objects = [];
var x = 500;
var y = 500;
var time = 60;


function draw() {
    cvns = new Canvas(x, y);

    //randomBalls(4);

    sameDirection();
    
    //test2DHoriz();
    
    //test2DVert();

    //diagnalTest();

    //testGlanceDiag();

    //testGlanceVert();

    //testGlanceHoriz();
    

    animation = setInterval(doAnim, time)
}
