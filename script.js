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