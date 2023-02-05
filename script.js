const root = document.getElementById('root')
const alertMsg = document.createElement('p')
const leaderbord = document.getElementById("leaderbord")
const points = document.createElement('p')
const level = document.createElement('p')
const counter = document.createElement('p')
const info = document.getElementById('info')
const levelsMap = {}
const startButton = document.createElement('button');
const dialog = document.createElement('dialog')
const playerNameInp = document.createElement('input')
let playerName
const dialogButton = document.createElement('button')
const dialogText = document.createElement('p')

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
let winner = false;

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
    const id = setInterval(moveObj, speed, obj);
    obj.setAttribute("interval", id);
}

const updateDialog = (j) => {
    dialogText.textContent = `You are number ${j+1}! Wow! Congratulations! Please, enter your name`
    root.append(dialog)
}

const createDialog = () => {
    playerNameInp.setAttribute('type', 'text')
    dialogButton.append('OK')
    const form = document.createElement('form')
    form.setAttribute('method', 'dialog')
    form.append(playerNameInp, dialogButton)
    dialog.append(dialogText)
    dialog.append(form)
    dialog.classList.add('dialog')
}

const showDialog = (j) => {
    updateDialog(j)
    dialog.showModal()
    playerNameInp.addEventListener('change', () => { dialogButton.value = playerNameInp.value })
    dialog.addEventListener('close', () => {
        playerName = dialog.returnValue
        playerNameInp.value = ''
    });
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

async function updateLeaderboard() {
    for (let j = 0; j < 5; j++) {
        if (leaders[j].points < currentPoints) {
            winner = true;
            showDialog(j)
            await (async () => {
                return new Promise((res) => {
                    dialog.onclose = () => res(true);
                });
            })();
            const newLeader = {
                player: playerName ? playerName : 'Anonymous',
                points: currentPoints,
            }
            leaders.splice(j, 0, newLeader);
            leaders.pop();
            renderLeaderbord();
            break;
        }
    }
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

    if (x <= 0 || x >= rootWidth - objWidth) {
        vX = -vX;
    }

    if (y <= 0 || y >= rootHeight - objHeight) {
        vY = -vY;
    }

    obj.style.left = `${x}px`;
    obj.style.top = `${y}px`;

    obj.setAttribute("coordY", y);
    obj.setAttribute("coordX", x);
    obj.setAttribute("velY", vY);
    obj.setAttribute("velX", vX);

}

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
    let parent = e.currentTarget
    let child = document.getElementById(data)

    if (parent.dataset.zoneColor === child.dataset.boxColor) {
        clearInterval(child.getAttribute('interval'))
        child.setAttribute('draggable', false)
        child.classList.add('dropped')
        parent.appendChild(child)
        child.removeEventListener('dragstart', onDragStart)
        child.removeEventListener('dragend', onDragEnd)

        root.style.color = parent.dataset.zoneColor
        root.classList.add('glow')
        setTimeout(() => { root.classList.remove('glow') }, 1000)

        currentPoints++
        droppedBoxes++
        points.innerText = currentPoints

        if (droppedBoxes === levelsMap[currentLevel].boxesAmt * levelsMap[currentLevel].colorsAmt) {
            levelUp()
        }
    } else {
        alertMsg.style.display = 'block'
    }
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
    alertMsg.style.display = 'none';
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

const levelUp = () => {
    currentLevel++
    if (!levelsMap[currentLevel]) {
        clearInterval(countDownId)
        finishGame()
    } else {
        droppedBoxes = 0
        level.innerText = currentLevel
        generateField()
    }
}

const finishGame = async () => {
    await updateLeaderboard();
    root.innerHTML = ''
    if (winner) {
        alertMsg.innerText = 'You won!'
        alertMsg.style.color = 'green'
    } else {
        alertMsg.innerText = 'You lost:('
        alertMsg.style.color = 'red'
    }

    alertMsg.style.display = 'block'
    root.append(alertMsg, startButton)
    startButton.classList.toggle("invisible");
}

const start = () => {
    currentLevel = 1;
    currentPoints = 0;
    droppedBoxes = 0;
    winner = false;
    generateLevels()
    generateField()
    generateInfo()
    renderLeaderbord()
    startButton.classList.toggle("invisible");
}

startButton.addEventListener("click", start);

const generateOnboarding = () => {
    alertMsg.classList.add('alert')
    alertMsg.textContent = "In this game you have to catch each flying square box and drag it onto rectangle of the same color";
    alertMsg.style.color = 'black'
    alertMsg.style.display = "block";
    startButton.classList.add('startbtn')
    startButton.textContent = "Start new game";
    root.append(alertMsg, startButton);
    createDialog()
}

generateOnboarding()