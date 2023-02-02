function makeFly (obj) {
    // const newBox = document.createElement('div');
    let roundN = 5;
    let coordX = 0;
    let coordY = 0;
    let velX = Math.floor(Math.random() * roundN - 2);
    let velY = Math.floor(Math.random() * roundN - 2);
    obj.setAttribute("coordX", coordX);
    obj.setAttribute("coordY", coordY);
    obj.setAttribute("velX", velX);
    obj.setAttribute("velY", velY);
    obj.setAttribute("interval", setInterval(move(obj), 1));
}

function move (obj) {
    obj.coordX += obj.velX;
    obj.coordY += obj.velY;
    obj.style.left = `${obj.coordX}px`;
    obj.style.top =  `${obj.coordY}px`;
    if (obj.coordX <= 0 || obj.coordX >= 500)  {
        obj
    }
}