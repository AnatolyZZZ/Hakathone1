function makeFly(obj) {
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
    // console.log(`speed: ${speed}`);
    
    const id = setInterval(moveObj, speed, obj);
    obj.setAttribute("interval", id);   
}

function moveObj(obj) {
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
    obj.style.top = `${y}px`;

    obj.setAttribute("coordY", y);
    obj.setAttribute("coordX", x);
    obj.setAttribute("velY", vY);
    obj.setAttribute("velX", vX);

}


const root = document.getElementById('root')
const alertMsg = document.createElement('p')
alertMsg.classList.add('alert')
const points = document.createElement('p')
const level = document.createElement('p')
const counter = document.createElement('p')
const info = document.getElementById('info')
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


let currentLevel = 1
let currentPoints = 0
let boxesId = 0
let countDownId

const onDragStart = (e) => {
    alertMsg.style.display = 'none'
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
        clearInterval(child.getAttribute('interval'))
        child.style.position = 'relative'
        child.style.left = '0px'
        child.style.top = '0px'

        child.setAttribute('draggable', false)
        child.classList.add('dropped')
        parent.appendChild(child)
        currentPoints++
        console.log(levelsMap[currentLevel])
        if (currentPoints === levelsMap[currentLevel].boxesAmt * levelsMap[currentLevel].colorsAmt) {
            console.log('level finished')
            levelUp()
        }
        points.innerText = currentPoints
    } else {
        alertMsg.style.display = 'block'
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

        box.addEventListener('dragstart', onDragStart, true)

        root.append(box)
        makeFly(box)

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

const generateError = () => {
    alertMsg.style.color = 'red'
    alertMsg.append('Wrooong!')
    root.append(alertMsg)
}


const generateField = () => {
    const { colorsAmt, boxesAmt } = levelsMap[currentLevel]
    boxesId = 0
    for (let i = 0; i < colorsAmt; i++) {
        let color = `#${((Math.random() * 0xfffff * 100000).toString(16)).slice(0, 6)}`
        generateBoxes(color, boxesAmt)
        generateZones(color)
    }
    generateInfo()
    generateError()
    let id = countDown()
}


const generateInfo = () => {
    points.innerText = currentPoints
    level.innerText = currentLevel
    counter.innerText = '00:30'
    info.append(points, level, counter)
}


const levelUp = () => {
    currentLevel++
    if (!levelsMap[currentLevel]) {
        clearInterval(countDownId)
        finishGame(true)
    } else {
        currentPoints = 0
        root.innerHTML = ''
        generateField(4)
    }
}

const countDown = () => {
    clearInterval(countDownId)
    let x = 30
    countDownId = setInterval(()=>{
        if(x < 0){
            finishGame()
            clearInterval(countDownId)
            return
        } else {
            counter.innerText = `00:${x < 10 ? '0': ''}${x}`
            x--
        }
    }, 1000)
}

const finishGame = (bool = false) => {
    root.innerHTML = ''
    if(bool){
        alertMsg.innerText = 'You won'
        alertMsg.style.color = 'green'
    } else {
        alertMsg.innerText = 'You lost'
        alertMsg.style.color = 'red'
    }
    
    alertMsg.style.display = 'block'
    root.append(alertMsg)
}

generateField()