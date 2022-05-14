
function dot(u, v) {
    return ((u.x - (u.x + u.dx)) * (v.x - (v.x + v.dx)) + (u.y - (u.y + u.dy)) * (v. y - (v.y + v.dy)));
}

function dot2(ux1, ux2, uy1, uy2, vx1, vx2, vy1, vy2) {
    return (ux2 - ux1) * (vx2 - vx1) + (uy2 - vy1) * (vy2 - vy1);
}

function vectorAngles(u, v) {
    return Math.acos(dot(u, v) / (u.mag() * v.mag()));
}

function vectorAngles2(u, v, umag, vmag) {
    console.log(u.x, u.dx, u.y, u.dy, v.x, v.dy, u.mag(), v.mag());
    return Math.acos(dot2(u.x, u.x + u.dx, 
	    		  u.y, u.y + u.dy, 
	    	   	  v.x, v.x + v.dx,
    			  v.y, v.y + v.dy) / (umag * vmag));
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

    incedentAngle(v) {
    	return vectorAngles2(this, v, this.mag(), v.mag())
    }

    doCollisions(objects) {
        for(let i = 0; i < objects.length; i++) {
            if (objects[i] == this) { 
                continue; 
            }
            
            let distanceSq = this.squaredDistanceFrom(objects[i]);
            let radiusSumSq = (this.r + objects[i].r) * (this.r + objects[i].r);

	    if (distanceSq <= radiusSumSq) {

                if (this.dx == 0 && this.dy == 0 || objects[i].dx == 0 && objects[i].dy == 0) {
                    continue;
                }

                // let theta = vectorAngles(this, objects[i]);
		        let theta = this.incedentAngle(objects[i]);
                

                console.log("theta: ", theta, "cos(theta):", Math.cos(theta), Math.sin(theta), this.mag(), objects[i].mag());

                this.dx = - this.dx * Math.cos(2*theta) + this.dy * Math.sin(2*theta);
                this.dy = this.dx * Math.sin(2*theta) + this.dy * -Math.cos(2*theta);

                console.log('b', this.dy, objects[i].dy);

                objects[i].dx = - objects[i].dx * Math.cos(2*theta) + objects[i].dy * Math.sin(2*theta);
                objects[i].dy = objects[i].dx * Math.sin(2*theta) + objects[i].dy * -Math.cos(2*theta);

                console.log('a', this.dy, objects[i].dy);
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

function test2DHoriz() {
    objects.push(new Circle(1, 200, 250, 10, 5, 0, false, cvns));
    objects.push(new Circle(1, 600, 250, 10, -5, 0, true, cvns));
}

function test2DVert() {
    objects.push(new Circle(1, 200, 150, 10, 0, 5, false, cvns));
    objects.push(new Circle(1, 200, 250, 10, 0, -5, true, cvns));
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


var esp = 20;

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
    
    //test2DHoriz();
    
    test2DVert();

    //testGlanceVert();

    //testGlanceHoriz();
    
    //diagnalTest();


    setInterval(doAnim, 50)
}
