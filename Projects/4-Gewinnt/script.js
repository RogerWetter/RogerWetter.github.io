let currentColor = "red"
let stateSeq = []
let state = Array(6).fill('').map(el => Array(7).fill(''))
let gameActive = true

function showBoard() {
    let board = document.querySelector(".board")
    while (board.firstChild !== null) {
        board.removeChild(board.firstChild)
    }
    for (let r = 0; r < 6; r++) {
        for (let i = 0; i < 7; i++) {
            let child = document.createElement("div")
            child.setAttribute("class", state[r][i] + " piece")
            board.appendChild(elt('div', {
                class: "field",
                id: r + "-" + i
            }, child))
        }
    }
}

function undo() {
    let color
    let text
    if (currentColor === "red") {
        color = "blue"
        text = "Rot ist dran!"
    } else {
        color = "red"
        text = "Blau ist dran!"
    }
    if (stateSeq.length>0) {
        state = stateSeq.pop()
        document.getElementById("output").innerText = text
        currentColor = color
    }
    showBoard()
}

function newGame() {
    state = Array(6).fill('').map(el => Array(7).fill(''))
    showBoard()
    gameActive = true
    let output = document.getElementById("output")
    output.removeAttribute("class")
    if (currentColor === "red") {
        output.innerText = "Lass uns nochmals spielen! Blau ist dran"
    } else {
        output.innerText = "Lass uns nochmals spielen! Rot ist dran"
    }
}

function winner(a) {
    let output = document.getElementById("output");
    gameActive = false
    output.innerText = "The Player with the " + currentColor + " coins has won!!!"
    if (currentColor === "red") {
        output.setAttribute("class", "glow-red-text")
        document.getElementById(a[0][0] + "-" + a[0][1]).childNodes.forEach(value => value.setAttribute("class", "field red piece glow-red"))
        document.getElementById(a[1][0] + "-" + a[1][1]).childNodes.forEach(value => value.setAttribute("class", "field red piece glow-red"))
        document.getElementById(a[2][0] + "-" + a[2][1]).childNodes.forEach(value => value.setAttribute("class", "field red piece glow-red"))
        document.getElementById(a[3][0] + "-" + a[3][1]).childNodes.forEach(value => value.setAttribute("class", "field red piece glow-red"))
    } else {
        output.setAttribute("class", "glow-blue-text")
        document.getElementById(a[0][0] + "-" + a[0][1]).childNodes.forEach(value => value.setAttribute("class", "field blue piece glow-blue"))
        document.getElementById(a[1][0] + "-" + a[1][1]).childNodes.forEach(value => value.setAttribute("class", "field blue piece glow-blue"))
        document.getElementById(a[2][0] + "-" + a[2][1]).childNodes.forEach(value => value.setAttribute("class", "field blue piece glow-blue"))
        document.getElementById(a[3][0] + "-" + a[3][1]).childNodes.forEach(value => value.setAttribute("class", "field blue piece glow-blue"))
    }
}

function noWinner() {
    document.getElementById("output").innerText = "also... niemand hat gewonnen..."
    gameActive = false
}

function checkWinner() {
    for (let r = 0; r < 6; r++) {
        for (let i = 0; i < 7 - 3; i++) {
            if (state[r][i] === currentColor
                && state[r][i + 1] === currentColor
                && state[r][i + 2] === currentColor
                && state[r][i + 3] === currentColor) {
                winner([
                    [r, i],
                    [r, i + 1],
                    [r, i + 2],
                    [r, i + 3]
                ])
            }

        }
    }
    for (let i = 0; i < 7; i++) {
        for (let r = 0; r < 6 - 3; r++) {
            if (state[r][i] === currentColor
                && state[r + 1][i] === currentColor
                && state[r + 2][i] === currentColor
                && state[r + 3][i] === currentColor) {
                winner([
                    [r, i],
                    [r + 1, i],
                    [r + 2, i],
                    [r + 3, i]
                ])
            }
        }
    }
    for (let r = 0; r < 3; r++) {
        for (let i = 0; i < 4; i++) {
            if (state[r][i] === currentColor
                && state[r + 1][i + 1] === currentColor
                && state[r + 2][i + 2] === currentColor
                && state[r + 3][i + 3] === currentColor) {
                winner([
                    [r, i],
                    [r + 1, i + 1],
                    [r + 2, i + 2],
                    [r + 3, i + 3]
                ])
            }
        }
    }
    for (let r = 0; r < 3; r++) {
        for (let i = 6; i >= 2; i--) {
            if (state[r][i] === currentColor
                && state[r + 1][i - 1] === currentColor
                && state[r + 2][i - 2] === currentColor
                && state[r + 3][i - 3] === currentColor) {
                winner([
                    [r, i],
                    [r + 1, i - 1],
                    [r + 2, i - 2],
                    [r + 3, i - 3]
                ])
            }
        }
    }
}

function updateBoard(color, column) {
    let set = false
    for (let i = 0; i < 6; i++) {
        if (state[5 - i][column] === "") {
            state[5 - i][column] = color
            set = true
            break
        }
    }
    return set
}

function checkSpace() {
    for (let r = 0; r < 6; r++) {
        for (let i = 0; i < 7; i++) {
            if (state[r][i] === "") {
                return true
            }

        }
    }
    return false
}

function clickedBoard(e) {
    if (gameActive) {
        let column
        if (e.target.parentNode.id === "") {
            column = e.target.id.charAt(2)
        } else {
            column = e.target.parentNode.id.charAt(2)
        }
        let text
        let color
        if (currentColor === "red") {
            color = "blue"
            text = "Rot ist dran!"
        } else {
            color = "red"
            text = "Blau ist dran!"
        }
        stateSeq.push(JSON.parse(JSON.stringify(state)))
        if (updateBoard(color, column)) {
            document.getElementById("output").innerText = text
            currentColor = color
            showBoard()
        }
        checkWinner()
        if (!checkSpace()) noWinner()
    } else newGame()
}

function elt(type, attrs, ...children) {
    let node = document.createElement(type)
    for (let a in attrs) {
        node.setAttribute(a, attrs[a])
    }
    for (let child of children) {
        if (typeof child != "string") node.appendChild(child)
        else node.appendChild(document.createTextNode(child))
    }
    return node
}
