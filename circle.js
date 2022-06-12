class Circle extends Object {
    constructor(m, x, y, r, dx, dy, fill, canvas, color) {
        super(m, x, y, dx, dy)
        this.r = r;
        this.fill = fill; // True for fill, false for stroke
        this.canvas = canvas;
        if (color) {
            this.color = color;
        } else {
            this.color = "black";
        }
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
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        circle.arc(x, y, r, 0, Math.PI * 2, true);
        if (fill == true) {
            ctx.fill(circle);
        } else {
            ctx.stroke(circle);
        }
    }
}
