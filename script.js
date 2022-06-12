

document.onkeypress = function(p) {
    p = p || window.event;
    //pause();
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
    objects.push(new Circle(1, 200, 250, 10, 5, 0, false, cvns));
    objects.push(new Circle(1, 600, 250, 10, -5, 0, false, cvns));
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
var nRandomBalls = 100;
var massMin = 1;
var massMax = 20;
var minDx = -10;
var maxDx = 20;
var minDy = -20;
var maxDy = 10;
var maxR = 1;
var minR = 10;
var cvns;
var objects = [];
var x = 800;
var y = 500;
var time = 10;

function getHtmlEleValue(id) {
    return document.getElementById(id).value;
}

function getHtmlCheckBox(id) {
    return document.getElementById(id).checked;
}

function addCircle() {
    pause();
    let m = parseFloat(getHtmlEleValue("mass"));
    let x = parseFloat(getHtmlEleValue("x"));
    let y = parseFloat(getHtmlEleValue("y"));
    let r = parseFloat(getHtmlEleValue("r"));
    let dx = parseFloat(getHtmlEleValue("dx"));
    let dy =  parseFloat(getHtmlEleValue("dy"));
    let fill = getHtmlCheckBox("fill");
    let color = getHtmlEleValue("color");
   
    objects.push(new Circle(m, x, y, r, dx, dy, fill, cvns, color));
    pause();
}

function draw() {

    if (!cvns) {
        cvns = new Canvas(x, y);
    } else {
        cvns.clear();
        cvns.reset();
    }

    testSelect = getHtmlEleValue("test-selector");
    nRandomBalls = getHtmlEleValue("nRandomBalls");
    minR = parseFloat(getHtmlEleValue("min-radius"));
    maxR = parseFloat(getHtmlEleValue("max-radius"));
    minDx = parseFloat(getHtmlEleValue("min-dx"));
    maxDx = parseFloat(getHtmlEleValue("max-dx"));
    minDy = parseFloat(getHtmlEleValue("min-dy"));
    maxDy = parseFloat(getHtmlEleValue("max-dy"))
    time = getHtmlEleValue("time");
    
    switch (testSelect) {
        case "randomBalls":
            randomBalls(nRandomBalls);
            break;
        case "sameDirection":
            sameDirection();
            break;
        case "test2DHoriz":
            test2DHoriz();
            break;
        case "test2DVert":
            test2DVert();
            break;
        case "diagnalTest":
            diagnalTest();
            break;
        case "testGlanceDiag":
            testGlanceDiag();
            break;
        case "testGlanceVert":
            testGlanceVert();
            break;
        case "testGlanceHoriz":
            testGlanceHoriz();
            break;
        case "custom":
            break;
    }

    animation = setInterval(doAnim, time)
}
