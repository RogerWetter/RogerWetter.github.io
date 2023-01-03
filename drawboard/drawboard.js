
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

window.addEventListener('load', () => {
  setCanvasSize()

  let drawing = false;
  let lineWidth = 5;
  let color = '#fff';
  const ongoingTouches = [];

  ctx.strokeStyle = '#fff'

  function startPosition(e) {
    drawing = true;
    draw(e);
  }

  function finishedPosition() {
    drawing = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!drawing) return
    ctx.lineWidth = lineWidth
    ctx.lineCap = "round"

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
    }

  }
  function touchmove(e) {
    e.preventDefault();
    const touches = e.changedTouches;

    for (const element of touches) {
      const idx = ongoingTouchIndexById(element.identifier);

      if (idx >= 0) {
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(element.pageX, element.pageY);
        ctx.lineWidth = lineWidth;
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
        ctx.lineWidth = lineWidth;
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

  canvas.addEventListener("mousedown", startPosition);
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

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
})