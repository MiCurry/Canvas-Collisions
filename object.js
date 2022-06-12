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
