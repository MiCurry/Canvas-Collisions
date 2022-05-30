
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
        return Math.atan2(this.yDistanceFrom(v), this.xDistanceFrom(v));
    }

    originAngle() {
        return Math.atan2(this.dy, this.dx); 
    }

    doCollisions(objects) {
        for(let i = 0; i < objects.length; i++) {
            if (objects[i] == this) { 
                continue; 
            }
            
            let distanceSq = this.squaredDistanceFrom(objects[i]);
            let radiusSumSq = (this.r + objects[i].r) * (this.r + objects[i].r);

	    if (distanceSq <= radiusSumSq + esp && !this.hasCollided(objects[i])) {
                //console.log("COLLISION");

                // Taken from https://williamecraver.wixsite.com/elastic-equations

                // let theta = vectorAngles(this, objects[i]);
                let t1 = this.originAngle();        // theta1
                let t2 = objects[i].originAngle();  // Theta2
                let ia = this.incedentAngle(objects[i]); // iangle

                let v1 = this.mag();
                let v2 = objects[i].mag();
                let m1 = this.m;
                let m2 = objects[i].m;

                // New x velocity for this
                let lhs = ((v1 * Math.cos(t1 - ia) * (m1 - m2) + 2*m2*v2*Math.cos(t2 - ia)) / (m1 + m2)) * Math.cos(ia);
                let rhs = v1 * Math.sin(t1 - ia) * Math.cos(ia + Math.PI / 2.0);
                let v1fx = lhs + rhs;

                // new y velocity for this
                lhs = ((v1 * Math.cos(t1 - ia) * (m1 - m2) + 2*m2*v2*Math.cos(t2 - ia)) / (m1 + m2)) * Math.sin(ia);
                rhs = v1 * Math.sin(t1 - ia) * Math.sin(ia + Math.PI / 2.0);
                let v1fy = lhs + rhs;

                // new dx for objects[i]
                lhs = ((v2 * Math.cos(t2 - ia) * (m2 - m1) + 2 * m1 * v1 * Math.cos(t1 - ia)) / (m1 + m2)) * Math.cos(ia);
                rhs = v2 * Math.sin(t2 - ia) * Math.cos(ia + Math.PI / 2.0);
                let v2fx = lhs + rhs;
                
                // new dy for objects[i]
                lhs = ((v2 * Math.cos(t2 - ia) * (m2 - m1) + 2 * m1 * v1 * Math.cos(t1 - ia)) / (m1 + m2)) * Math.sin(ia);
                rhs = v2 * Math.sin(t2 - ia) * Math.sin(ia + Math.PI / 2.0);
                let v2fy = lhs + rhs;


                let mdx = m1 * this.dx + m2 * objects[i].dx;
                let mdy = m1 * this.dy + m2 * objects[i].dy;


                if (nearlyEqual(v1fx, 0.0, 0.0005)) {
                    this.dx = 0.0;
                } else  {
                    this.dx = v1fx;
                }

                if (nearlyEqual(v1fy, 0.0, 0.0005)) {
                    this.dy = 0.0;
                } else  {
                    this.dy = v1fy;
                }

                if (nearlyEqual(v2fx, 0.0, 0.0005)) {
                    objects[i].dx = 0.0;
                } else  {
                    objects[i].dx = v2fx;
                }
                
                if (nearlyEqual(v2fy, 0.0, 0.0005)) {
                    objects[i].dy = 0.0;
                } else  {
                    objects[i].dy = v2fy;
                }

                let mpdx = m1 * this.dx + m2 * objects[i].dx;
                let mpdy = m1 * this.dy + m2 * objects[i].dy;

                //console.log(mdx, mdy, mpdx, mpdy);

                this.collided(objects[i]);
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
    m = Math.floor(Math.random() * (massMax - massMin) + massMin);
    return new Circle(r, x, y, r, dx, dy, false, cvns)
}

function randomBalls(n) {
    for (let i = 0; i < n; i++) {
        objects.push(randomCircle(cvns));
    }
}

function test2DHoriz() {
    objects.push(new Circle(1, 200, 250, 10, 20, 0, false, cvns));
    objects.push(new Circle(1, 600, 250, 10, -20, 0, false, cvns));
}

function test2DVert() {
    objects.push(new Circle(1, 200, 150, 10, 0, 5, false, cvns));
    objects.push(new Circle(1, 200, 250, 10, 0, -5, false, cvns));
}

function testGlanceVert() {
    objects.push(new Circle(1, 210, 150, 10, 0, 1, false, cvns));
    objects.push(new Circle(1, 200, 250, 10, 0, -1, true, cvns));
}

function testGlanceHoriz() {
    objects.push(new Circle(1, 250, 160, 10, -2, 0, false, cvns));
    objects.push(new Circle(1, 200, 150, 10, 2, 0, true, cvns));

    objects.push(new Circle(1, 250, 260, 10, -1, 0, false, cvns));
    objects.push(new Circle(1, 200, 250, 10, 1, 0, true, cvns));
}

function diagnalTest() {
    objects.push(new Circle(1, 150, 150, 10, 1, 1, false, cvns));
    objects.push(new Circle(1, 250, 250, 10, -1, -1, true, cvns));
}

function testGlanceDiag() {
    objects.push(new Circle(1, 150, 150, 10, 1, 1, false, cvns));
    objects.push(new Circle(1, 250, 260, 10, -1, -1, true, cvns));
}

function sameDirection() {
    objects.push(new Circle(1, 150, 150, 10, 5, 0, false, cvns));
    objects.push(new Circle(1, 200, 150, 10, 1, 0, true, cvns));
}


var esp = 50;
var nRandomBalls = 300;
var massMin = 1;
var massMax = 20;
var minDx = -5;
var maxDx = 5;
var minDy = -5;
var maxDy = 5;
var maxR = 1;
var minR = 10;
var cvns;
var objects = [];
var x = 800;
var y = 500;
var time = 10;


function draw() {
    cvns = new Canvas(x, y);

    randomBalls(nRandomBalls);

    //sameDirection();
    
    //test2DHoriz();
    
    //test2DVert();

    //diagnalTest();

    //testGlanceDiag();

    //testGlanceVert();

    //testGlanceHoriz();
    

    animation = setInterval(doAnim, time)
}
