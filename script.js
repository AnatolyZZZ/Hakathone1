
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
        makeFly(box);
        
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

