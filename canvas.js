class Canvas { 
    constructor(width, height, objects) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById('canvas');
        this.objects = objects;
        this.ctx = this.canvas.getContext('2d');
    }


    removeObjt(obj) {
        let index = objects.indexOf(obj);
        if (index > -1) {
            objects.splice(index, 1)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    reset() {
        objects = [];
        clearInterval(animation)
    }

    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x : evt.clientX - rect.left,
            y : evt.clientY - rect.top
        };
    }
}

