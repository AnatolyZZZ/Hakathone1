
function makeFly (obj) {
    let roundN = 5;
    let coordX = 10;
    let coordY = 10;
    let velX = Math.floor(Math.random() * roundN - 2);
    let velY = Math.floor(Math.random() * roundN - 2);
    obj.setAttribute("coordX", coordX);
    obj.setAttribute("coordY", coordY);
    obj.setAttribute("velX", velX);
    obj.setAttribute("velY", velY);
    const id = setInterval(moveObj, 20, obj);
    obj.setAttribute("interval", id);
}

function moveObj (obj) {
    let x = +obj.getAttribute("coordX");
    let y = +obj.getAttribute("coordY");
    let vX = +obj.getAttribute("velX");
    let vY = +obj.getAttribute("velY");

    x += vX;
    y += vY;

    if (x <= 0 || x >= 400)  {
        vX = -vX;
        console.log(`coordinate x ${x} speed vX ${vX}`);
        console.log(`coordinate y ${y} speed vY ${vY}`);
    }
    if (y <= 0 || y >= 400)  {
        vY = -vY;
        console.log(`coordinate x ${x} speed vX ${vX}`);
        console.log(`coordinate y ${y} speed vY ${vY}`);
    }

    obj.style.left = `${x}px`;
    obj.style.top =  `${y}px`;

    obj.setAttribute("coordY", y);
    obj.setAttribute("coordX", x);
    obj.setAttribute("velY", vY);
    obj.setAttribute("velX", vX);

}


const root = document.getElementById('root')
const error = document.createElement('p')
let boxesId = 0

const onDragStart = (e) => {
    console.log(e.target.id)
    error.style.display = 'none'
    e.dataTransfer.setData("text/plain", e.target.id)
}

const onDragOver = (e) => {
    e.preventDefault()
}

const onDrop = (e) => {
    e.preventDefault()
    let data = e.dataTransfer.getData("text/plain");
    
    // checking if target is correct zone
    // console.log(e.eventPhase)
    // console.log(e.target)
    // console.log(e.currentTarget)

    let parent = e.currentTarget
    let child = document.getElementById(data)
    if (parent.dataset.zoneColor === child.dataset.boxColor) {
        child.setAttribute('draggable', false)
        child.classList.add('dropped')
        parent.appendChild(child)
    } else {
        error.style.display = 'block'
    }
}

const generateBoxes = (color, amount) => {
    for (let i = 0; i < amount; i++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.style.background = color
        box.setAttribute('id', boxesId)
        box.setAttribute('data-box-color', color)
        boxesId++
        box.setAttribute('draggable', true)
        makeFly(box);
        box.addEventListener('dragstart', onDragStart)

        root.append(box)
    }
}

const generateZones = (color) => {
    const zone = document.createElement('div')
    zone.setAttribute('data-zone-color', color)
    zone.classList.add('zone')
    zone.style.background = color
    zone.addEventListener('dragover', onDragOver)

    // boolean true stops bubbling which prevents appending box to another box in the zone
    zone.addEventListener('drop', onDrop, true)
    root.append(zone)
}

const createError = () => {
    error.classList.add('error')
    error.append('Wrooong!')
    root.append(error)
}


const generateField = (numOfColors) => {
    for (let i = 0; i < numOfColors; i++) {
        let color = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`
        generateBoxes(color, 3)
        generateZones(color)
    }
}
generateField(3)
createError()
