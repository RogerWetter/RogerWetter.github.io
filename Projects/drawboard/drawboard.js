
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const saveToGalleryBtn = document.getElementById('saveToGalleryBtn')
const drawboardStatus = document.getElementById('drawboard-status')
let lineWidth = 5
let erasing = false
const galleryStorageKey = 'rw.gallery.customImages'

window.addEventListener('load', () => {
  setCanvasSize()

  let drawing = false;
  const ongoingTouches = [];

  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'
  ctx.lineWidth = 5
  ctx.lineCap = "round"

  function startPosition(e) {
    if (e.button !== 0) return
    drawing = true;
    draw(e);
  }

  function finishedPosition(e) {
    if (e.button !== 0) return
    drawing = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (e.button !== 0 || !drawing) return
    ctx.lineTo(e.clientX, e.clientY)
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY)
  }
  function touchStart(e) {
    e.preventDefault();
    const touches = e.changedTouches;
    for (const element of touches) {
      ongoingTouches.push(copyTouch(element));
      ctx.beginPath();
      ctx.arc(element.pageX, element.pageY, lineWidth/2, 0, 2 * Math.PI, false)
      ctx.fill()
    }

  }
  function touchmove(e) {
    e.preventDefault();
    const touches = e.changedTouches;

    for (const element of touches) {
      const idx = ongoingTouchIndexById(element.identifier);

      if (idx >= 0) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(element.pageX, element.pageY);
        ctx.lineCap = "round"
        ctx.stroke();

        ongoingTouches.splice(idx, 1, copyTouch(element));
      }
    }
  }

  function touchend(e) {
    e.preventDefault();
    const touches = e.changedTouches;

    for (const element of touches) {
      let idx = ongoingTouchIndexById(element.identifier);
      if (idx >= 0) {
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(element.pageX, element.pageY);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
      }
    }
  }

  function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      const id = ongoingTouches[i].identifier;
      if (id === idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }
  function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
  }

  canvas.addEventListener("mousedown", (e) => {
    startPosition(e)
  });
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);
  //canvas.addEventListener('mouseout', finishedPosition)

  canvas.addEventListener('touchstart', touchStart);
  canvas.addEventListener('touchend', touchend);
  canvas.addEventListener('touchmove', touchmove);
})

window.addEventListener('resize', setCanvasSize)
function setCanvasSize() {
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
}

document.getElementById('colorPicker').addEventListener('load', (color) =>{
  ctx.strokeStyle = color.target.value
  ctx.fillStyle = color.target.value
})
document.getElementById('colorPicker').addEventListener('change', (color) =>{
  ctx.strokeStyle = color.target.value
  ctx.fillStyle = color.target.value
})
document.getElementById('lineWidthPicker').addEventListener('load', () =>{
  lineWidth = document.getElementById('lineWidthPicker').value
  ctx.lineWidth = lineWidth
})
document.getElementById('lineWidthPicker').addEventListener('change', () =>{
  lineWidth = document.getElementById('lineWidthPicker').value
  ctx.lineWidth = lineWidth
})

document.getElementById('clearBtn').onclick = () => {
  if (confirm('Sure you want to clear the whole site?'))
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const eraserBtn = document.getElementById('eraserBtn')

eraserBtn.onclick = () => {
  erasing = !erasing
  eraserBtn.className = erasing? 'pressed button' : 'button'
  canvas.className = erasing? 'canvas-erasing' : 'canvas-drawing'
  ctx.globalCompositeOperation = erasing? "destination-out" : "source-over"
}

const showStatus = (message) => {
  drawboardStatus.textContent = message
  drawboardStatus.style.display = 'block'
  window.setTimeout(() => {
    drawboardStatus.style.display = 'none'
  }, 5000)
}

const normalizeName = (name) => name
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '')
  .slice(0, 60)

const hasVisibleDrawing = () => {
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] !== 0) return true
  }
  return false
}

const getStoredGalleryImages = () => {
  const storedImages = localStorage.getItem(galleryStorageKey)
  if (!storedImages) return []
  try {
    const parsed = JSON.parse(storedImages)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

saveToGalleryBtn.onclick = () => {
  if (!hasVisibleDrawing()) {
    showStatus('Zeichne erst etwas, bevor du es in die Galerie speicherst.')
    return
  }

  const suggestedName = `bild-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`
  const enteredName = prompt('Name für dein Bild:', suggestedName)
  if (enteredName === null) return

  const safeName = normalizeName(enteredName)
  if (!safeName) {
    showStatus('Bitte gib einen gültigen Bildnamen ein.')
    return
  }

  const warningAccepted = confirm(
    'Achtung: Galerie-Inhalte sind öffentlich sichtbar und für alle Besucher einsehbar. ' +
    'Bitte teile keine privaten Daten. Möchtest du das Bild trotzdem speichern?'
  )
  if (!warningAccepted) return

  const newImage = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: safeName,
    source: 'drawboard',
    createdAt: new Date().toISOString(),
    url: canvas.toDataURL('image/png')
  }

  const images = [newImage, ...getStoredGalleryImages()].slice(0, 40)
  localStorage.setItem(galleryStorageKey, JSON.stringify(images))
  showStatus('Gespeichert! Du findest dein Bild jetzt in der Galerie.')
  window.setTimeout(() => {
    window.location.href = '/Gallery/'
  }, 800)
}
