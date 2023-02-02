
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

const root = document.getElementById('root')

const onDragStart = (e) => {
    console.log(e.target.id)
    e.dataTransfer.setData("text/plain", e.target.id)
}

const onDragOver = (e) => {
    e.preventDefault()
    console.log(e.dataTransfer)
}

const onDrop = (e) => {
    e.preventDefault()
    let data = e.dataTransfer.getData("text/plain");
    console.log(data)
    let child = document.getElementById(data)
    child.setAttribute('draggable', false)
    child.classList.add('dropped')
    e.target.appendChild(child)
}

const generateBoxes = () => {
    for (let i = 0; i < 2; i++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.setAttribute('id', i)
        box.setAttribute('draggable', true)
        
        box.addEventListener('dragstart', onDragStart)
        
        root.append(box)
    }
}

const generateZones = () => {
    const zone = document.createElement('div')
    zone.classList.add('zone')
    zone.addEventListener('dragover', onDragOver)
    zone.addEventListener('drop', onDrop)
    root.append(zone)
}

generateBoxes()
generateZones()

