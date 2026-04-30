
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const saveToGalleryBtn = document.getElementById('saveToGalleryBtn')
const drawboardStatus = document.getElementById('drawboard-status')
let lineWidth = 5
let erasing = false
const galleryStorageKey = 'rw.gallery.customImages'
const REDIRECT_DELAY_MS = 800
const GALLERY_PATH = '/Gallery/'
const GITHUB_OWNER = 'RogerWetter'
const GITHUB_REPO = 'RogerWetter.github.io'
const GALLERY_SUBMISSION_LABEL = 'gallery-submission'
const GALLERY_SUBMISSION_MARKER = '<!-- gallery-submission -->'
const t = (key, values = {}) => window.RW_I18N?.t(key, values) ?? key

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
  if (confirm(t('drawboard.confirmClear')))
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

const formatDatePart = (value) => value.toString().padStart(2, '0')

const getLocalSuggestedName = () => {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = formatDatePart(now.getMonth() + 1)
  const dd = formatDatePart(now.getDate())
  const hh = formatDatePart(now.getHours())
  const min = formatDatePart(now.getMinutes())
  const ss = formatDatePart(now.getSeconds())
  return `bild-${yyyy}-${mm}-${dd}-${hh}-${min}-${ss}`
}

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

const triggerDownload = (dataUrl, filename) => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const buildSubmissionIssueUrl = (safeName) => {
  // The issue body intentionally contains a placeholder where the user
  // drops the PNG file we just downloaded. A backend workflow then parses
  // the attachment URL and opens a PR. The marker lets the workflow
  // recognise legitimate submissions even if a curious user opens an
  // issue with the same label by hand.
  const bodyLines = [
    GALLERY_SUBMISSION_MARKER,
    '',
    `**${t('drawboard.submission.imageName')}:** ${safeName}`,
    '',
    t('drawboard.submission.instructions'),
    '',
    '<!-- attach the image below this line -->',
    '',
  ]
  const params = new URLSearchParams({
    labels: GALLERY_SUBMISSION_LABEL,
    title: `${t('drawboard.submission.titlePrefix')}: ${safeName}`,
    body: bodyLines.join('\n'),
  })
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?${params.toString()}`
}

saveToGalleryBtn.onclick = () => {
  if (!hasVisibleDrawing()) {
    showStatus(t('drawboard.empty'))
    return
  }

  const suggestedName = getLocalSuggestedName()
  const enteredName = prompt(t('drawboard.promptName'), suggestedName)
  if (enteredName === null) return

  const safeName = normalizeName(enteredName)
  if (!safeName) {
    showStatus(t('drawboard.invalidName'))
    return
  }

  const warningAccepted = confirm(t('drawboard.publicWarning'))
  if (!warningAccepted) return

  const dataUrl = canvas.toDataURL('image/png')

  const newImage = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: safeName,
    source: 'drawboard',
    createdAt: new Date().toISOString(),
    url: dataUrl
  }

  const images = [newImage, ...getStoredGalleryImages()].slice(0, 40)
  localStorage.setItem(galleryStorageKey, JSON.stringify(images))

  // Second prompt: should this drawing also be submitted to the public
  // gallery for review? "Cancel" keeps the previous behaviour (local
  // only) so the existing flow is preserved by default.
  const submitForReview = confirm(t('drawboard.submitPrompt'))
  if (submitForReview) {
    triggerDownload(dataUrl, `${safeName}.png`)
    const issueUrl = buildSubmissionIssueUrl(safeName)
    // Open the prefilled issue in a new tab. Some browsers block
    // window.open if it is not the immediate result of a user gesture;
    // confirm() preserves the gesture so this is safe here.
    const opened = window.open(issueUrl, '_blank', 'noopener,noreferrer')
    if (!opened) {
      // Popup blocked: fall back to navigating in the same tab after a
      // short delay so the user still sees the saved-status message.
      window.setTimeout(() => {
        window.location.href = issueUrl
      }, REDIRECT_DELAY_MS)
      showStatus(t('drawboard.submission.opening'))
      return
    }
    showStatus(t('drawboard.submission.opened'))
    window.setTimeout(() => {
      window.location.href = GALLERY_PATH
    }, REDIRECT_DELAY_MS * 2)
    return
  }

  showStatus(t('drawboard.saved'))
  window.setTimeout(() => {
    window.location.href = GALLERY_PATH
  }, REDIRECT_DELAY_MS)
}

const updateDrawboardTexts = () => {
  const clearBtn = document.getElementById('clearBtn')
  const eraser = document.getElementById('eraserBtn')
  const colorPicker = document.getElementById('colorPicker')
  const lineWidthPicker = document.getElementById('lineWidthPicker')

  if (clearBtn) {
    clearBtn.textContent = 'C'
    clearBtn.setAttribute('aria-label', t('drawboard.clear'))
    clearBtn.setAttribute('title', t('drawboard.clear'))
  }
  if (eraser) {
    eraser.setAttribute('aria-label', t('drawboard.eraser'))
    eraser.setAttribute('title', t('drawboard.eraser'))
  }
  if (colorPicker) {
    colorPicker.setAttribute('aria-label', t('drawboard.color'))
    colorPicker.setAttribute('title', t('drawboard.color'))
  }
  if (lineWidthPicker) {
    lineWidthPicker.setAttribute('aria-label', t('drawboard.width'))
    lineWidthPicker.setAttribute('title', t('drawboard.width'))
  }
  if (saveToGalleryBtn) saveToGalleryBtn.textContent = t('drawboard.save')
  if (canvas) canvas.setAttribute('aria-label', t('drawboard.canvas'))
}

document.addEventListener('rw:language-changed', updateDrawboardTexts)
updateDrawboardTexts()
