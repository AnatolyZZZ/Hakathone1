
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

    let speed = levelsMap[currentLevel].speed;
    
    speed = Math.floor(20/speed);
    console.log(`speed: ${speed}`);
    
    const id = setInterval(moveObj, speed, obj);
    obj.setAttribute("interval", id);   
}

function moveObj (obj) {
    let x = +obj.getAttribute("coordX");
    let y = +obj.getAttribute("coordY");
    let vX = +obj.getAttribute("velX");
    let vY = +obj.getAttribute("velY");

    x += vX;
    y += vY;

    const objWidth = getComputedStyle(obj).width.slice(0, -2);
    const rootWidth = getComputedStyle(root).width.slice(0, -2);
    // console.log(objWidth);

    if (x <= 0 || x >= rootWidth-objWidth)  {
        vX = -vX;
        // console.log(`coordinate x ${x} speed vX ${vX}`);
        // console.log(`coordinate y ${y} speed vY ${vY}`);
    }
    if (y <= 0 || y >= rootWidth-objWidth)  {
        vY = -vY;
        // console.log(`coordinate x ${x} speed vX ${vX}`);
        // console.log(`coordinate y ${y} speed vY ${vY}`);
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
const points = document.createElement('p')
const level = document.createElement('p')
const levelsMap = {
    1: {
        colorsAmt: 1,
        boxesAmt: 1,
        speed: 1
    },
    2: {
        colorsAmt: 2,
        boxesAmt: 1,
        speed: 2
    },
    3: {
        colorsAmt: 2,
        boxesAmt: 2,
        speed: 3
    },
}

let boxesId = 0
let currentLevel = 1
let currentPoints = 0

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
        currentPoints++
        console.log(levelsMap[currentLevel])
        if(currentPoints === levelsMap[currentLevel].boxesAmt*levelsMap[currentLevel].colorsAmt){
                console.log('level finished')
            levelUp()
        }
        points.innerText = currentPoints
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

        

        box.addEventListener('dragstart', onDragStart)

        root.append(box)
        makeFly(box);
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


const generateField = () => {
    const {colorsAmt, boxesAmt} = levelsMap[currentLevel]

    for (let i = 0; i < colorsAmt; i++) {
        let color = `#${((Math.random() * 0xfffff * 100000).toString(16)).slice(0, 6)}`
        console.log(color)
        generateBoxes(color, boxesAmt)
        generateZones(color)
    }
    generatePointsAndLevel()
}


const generatePointsAndLevel = () => {
    points.classList.add('points')
    points.innerText = currentPoints
    root.append(points)
    level.classList.add('level')
    level.innerText = currentLevel
    root.append(level)
}

const levelUp = () => {
    currentLevel++
    if(!levelsMap[currentLevel]){
        console.log('you won the game!')
    } else {
    currentPoints = 0
    root.innerHTML = ''
    generateField(4)}
}

generateField()

createError()
