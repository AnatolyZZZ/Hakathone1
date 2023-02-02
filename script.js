const root = document.getElementById('root')
const error = document.createElement('p')
const points = document.createElement('p')
const level = document.createElement('p')
const levelsMap = {
    1: {
        colorsAmt: 1,
        boxesAmt: 1,
    },
    2: {
        colorsAmt: 2,
        boxesAmt: 1
    },
    3: {
        colorsAmt: 2,
        boxesAmt: 2
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
