let cellSize = 0,
  columns = 30,
  row = 0,
  cellsTotal = 0

const genRandonString = (length) => {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    charLength = chars.length,
    result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength))
  }
  return result
}

const shapeGen = () => {
  let cursor = document.querySelector('.cursorInner')
  let contentBox = document.querySelector('.contentBox')
  let size = window.innerWidth / columns
  row = Math.round(window.innerHeight / size) + 1
  cellSize = size

  //Empty the container
  cursor.innerHTML = ''

  for (let i = 0; i < columns * row; i++) {
    let div = document.createElement('div')
    div.classList.add('cursorInnerBox')

    cursor.append(div)

    cellsTotal += 1
    let div2 = document.createElement('div')
    div2.classList.add('letterBox')
    div2.innerHTML = genRandonString(1)
    contentBox.append(div2)
  }
}

const shapeClick = () => {
  let cells = document.querySelectorAll('.cursorInnerBox')
  let mousepos = { x: 0, y: 0 }

  const updateMousePos = (ev) => {
    mousepos = {
      x: ev.clientX,
      y: ev.clientY,
    }
  }

  window.addEventListener('mousemove', updateMousePos)
  window.addEventListener('pointermove', updateMousePos, {
    passive: true,
  })

  function getCellAtCursor() {
    const columnIndex = Math.floor(mousepos.x / cellSize)
    const rowIndex = Math.floor(mousepos.y / cellSize)
    const cellIndex = rowIndex * columns + columnIndex

    if (cellIndex >= this.cellsTotal || cellIndex < 0) {
      console.error('Cell index out of bounds')
      return null
    }

    return cells[cellIndex]
  }

  const handleMove = () => {
    // Check which cell is being "hovered"
    const cell = getCellAtCursor()

    if (cell === null || this.cachedCell === cell) return

    this.cachedCell = cell

    gsap.set(cell, { opacity: 1 })

    gsap.set(cell, { opacity: 0, delay: 0.2 })
  }

  window.addEventListener('mousemove', handleMove)

  window.addEventListener('click', () => {
    gsap
      .timeline()
      .addLabel('start', 0)
      .to(
        cells,
        {
          duration: 1,
          ease: 'power4',
          opacity: 1,
          stagger: {
            from: [...cells].indexOf(getCellAtCursor()),
            each: 0.02,
            grid: [row, columns],
          },
        },
        'start'
      )
      .to(
        cells,
        {
          duration: 1,
          ease: 'power1',
          opacity: 0,
          stagger: {
            from: [...cells].indexOf(getCellAtCursor()),
            each: 0.03,
            grid: [row, columns],
          },
        },
        'start+=0.3'
      )
  })
}

setTimeout(() => {
  shapeGen()
  shapeClick()
}, 100)
