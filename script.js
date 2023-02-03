function makeFly(obj) {
    let roundN = 5;
    let coordX = 10;
    let coordY = 10;
    let velX = Math.floor(Math.random() * roundN - 2);
    let velY = Math.floor(Math.random() * roundN - 2);
    if (velX === 0 && velY === 0) {
        velX = 1;
        velY = 1;
    }

    obj.setAttribute("coordX", coordX);
    obj.setAttribute("coordY", coordY);
    obj.setAttribute("velX", velX);
    obj.setAttribute("velY", velY);

    let speed = levelsMap[currentLevel].speed;

    speed = Math.floor(20 / speed);
    // console.log(`speed: ${speed}`);

    const id = setInterval(moveObj, speed, obj);
    obj.setAttribute("interval", id);
}
function renderLeaderbord() {
    leaderbord.innerHTML = "";
    const h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("Leaders"));
    leaderbord.appendChild(h2);
    for (let j = 0; j < 5; j++) {
        const newLeaderDiv = document.createElement("div");
        newLeaderDiv.classList.add("name");
        const content = document.createTextNode(`${j + 1} ${leaders[j].player} ${leaders[j].points}pt`);
        newLeaderDiv.appendChild(content);
        leaderbord.appendChild(newLeaderDiv);
    }
}

function updateLeaderboard() {
    for (let j = 0; j < 5; j++) {
        if (leaders[j].points < currentPoints) {
            let playerName = prompt("You are one of leaders!!! Please enter your name.");
            const newLeader = {
                player: playerName,
                points: currentPoints,
            }
            leaders.splice(j, 1, newLeader);
            break;
        }
    }

    renderLeaderbord();
}


function moveObj(obj) {
    let x = +obj.getAttribute("coordX");
    let y = +obj.getAttribute("coordY");
    let vX = +obj.getAttribute("velX");
    let vY = +obj.getAttribute("velY");

    x += vX;
    y += vY;

    const objStyle = getComputedStyle(obj);
    const rootStyle = getComputedStyle(root);
    const objWidth = objStyle.width.slice(0, -2);
    const rootWidth = rootStyle.width.slice(0, -2);
    const objHeight = objStyle.height.slice(0, -2);
    const rootHeight = rootStyle.height.slice(0, -2);
    // console.log(objWidth);

    if (x <= 0 || x >= rootWidth - objWidth) {
        vX = -vX;
        // console.log(`coordinate x ${x} speed vX ${vX}`);
        // console.log(`coordinate y ${y} speed vY ${vY}`);
    }


    if (y <= 0 || y >= rootHeight - objHeight) {
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

const leaderbord = document.getElementById("leaderbord")

const points = document.createElement('p')
const level = document.createElement('p')
const counter = document.createElement('p')
const info = document.getElementById('info')
const levelsMap = {}
const startButton = document.getElementById("startbtn");


const leaders = [
    {
        player: "Boris",
        points: 20
    },
    {
        player: "Anna",
        points: 19
    },
    {
        player: "Egor",
        points: 10
    },
    {
        player: "Victor",
        points: 5
    },
    {
        player: "Elan",
        points: 3
    }
]

let currentLevel = 1
let currentPoints = 0
let droppedBoxes = 0
let boxesId = 0
let countDownId

const onDragStart = (e) => {
    alertMsg.style.display = 'none'
    e.target.classList.toggle('dragged')
    e.dataTransfer.setData("text/plain", e.target.id)
}

const onDragEnd = (e) => {
    e.target.classList.toggle('dragged')
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
        child.setAttribute('draggable', false)
        child.classList.add('dropped')
        parent.appendChild(child)
        root.style.color = parent.dataset.zoneColor
        console.log(root.style.color)
        root.classList.add('glow')
        setTimeout(() => { root.classList.remove('glow') }, 1000)
        currentPoints++
        droppedBoxes++
        console.log(levelsMap[currentLevel])
        if (droppedBoxes === levelsMap[currentLevel].boxesAmt * levelsMap[currentLevel].colorsAmt) {
            console.log('level finished')
            levelUp()
        }
        points.innerText = currentPoints
    } else {
        console.log('error')
        console.log(alertMsg)
        alertMsg.style.display = 'block'
    }
}

const generateBoxes = (color, amount) => {
    for (let i = 0; i < amount; i++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.style.background = color
        box.style.boxShadow = `0 0 10px ${color}`
        box.setAttribute('id', boxesId)
        box.setAttribute('data-box-color', color)
        boxesId++
        box.setAttribute('draggable', true)

        box.addEventListener('dragstart', onDragStart, true)
        box.addEventListener('dragend', onDragEnd, true)

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
    alertMsg.innerText = 'Wrooong!'
    root.append(alertMsg)
}


const generateField = () => {
    const { colorsAmt, boxesAmt } = levelsMap[currentLevel]
    countDown()
    setTimeout(() => {
        root.innerHTML = ''
        generateError()
        boxesId = 0
        for (let i = 0; i < colorsAmt; i++) {
            let color = `#${((Math.random() * 0xfffff * 100000).toString(16)).slice(0, 6)}`
            generateBoxes(color, boxesAmt)
            generateZones(color)
        }
    }, 1000)
}

const generateInfo = () => {
    const pointsLabel = document.createElement('p')
    pointsLabel.innerText = 'points '
    pointsLabel.classList.add('label')
    const levelLabel = document.createElement('p')
    levelLabel.innerText = 'level '
    levelLabel.classList.add('label')
    points.innerText = currentPoints
    level.innerText = currentLevel
    counter.innerText = '00:30'
    info.innerHTML = ''
    info.append(levelLabel, level, pointsLabel, points, counter)
}


const levelUp = () => {
    currentLevel++
    if (!levelsMap[currentLevel]) {
        clearInterval(countDownId)
        finishGame(true)
    } else {
        droppedBoxes = 0
        level.innerText = currentLevel
        generateField()
    }
}


const countDown = () => {
    clearInterval(countDownId)
    let x = 30
    countDownId = setInterval(() => {
        if (x < 0) {
            finishGame()
            clearInterval(countDownId)
            return
        } else {
            counter.innerText = `00:${x < 10 ? '0' : ''}${x}`
            x--
        }
    }, 1000)
}

const finishGame = (bool = false) => {
    root.innerHTML = ''
    if (bool) {
        alertMsg.innerText = 'You won'
        alertMsg.style.color = 'green'
    } else {
        alertMsg.innerText = 'You lost'
        alertMsg.style.color = 'red'
    }

    updateLeaderboard()

    alertMsg.style.display = 'block'
    root.append(alertMsg)
    startButton.classList.toggle("invisible");
}



const start = () => {
    currentLevel = 1;
    currentPoints = 0;
    droppedBoxes = 0;
    generateLevels()
    generateField()
    generateInfo()
    renderLeaderbord()
    startButton.classList.toggle("invisible");
}


const generateLevels = () => {
    let level = 1
    for (let i = 1; i <= 4; i++) {
        for (let j = 0; j <= 4; j++) {
            levelsMap[level] = {
                colorsAmt: j + i,
                boxesAmt: 2 * i,
                speed: 1 * i
            }
            level++
        }
    }
}

startButton.addEventListener("click", start);
