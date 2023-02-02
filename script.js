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

const generateBoxes = (color) => {
    for (let i = 0; i < 2; i++) {
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

generateBoxes('red')
generateBoxes('green')
generateZones('red')
generateZones('green')
createError()