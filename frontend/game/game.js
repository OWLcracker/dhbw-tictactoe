let scores,
    player,
    computer;

let gameHintElem,
    scoresElem,
    fieldsElem;

let delay = 1000;

window.addEventListener("load", () => {
    gameHintElem = document.getElementById("gameHint");
    scoresElem = document.querySelectorAll(".scoreValue")
    fieldsElem = document.querySelectorAll("#grid button");

    let grid = document.getElementById("grid");
    grid.addEventListener("mouseover", hoverEffectIn);
    grid.addEventListener("mouseout", hoverEffectOut);
    grid.addEventListener("click", playerTurn);

    document.getElementById("restart").addEventListener("click", restart);
    document.getElementById("menu").addEventListener("click", menu);

    initGame();
});

function initGame() {
    scores = [0, 0];

    // Assign symbol to player
    let scoresLabelElem = document.querySelectorAll(".scoreLabel");
    if (Math.random() < 0.5) {
        player = "x";
        computer = "o";
    } else {
        player = "o";
        computer = "x";
    }
    scoresLabelElem[0].innerHTML = "Score " + player + ":";
    scoresLabelElem[1].innerHTML = "Score " + computer + ":";
    scoresElem[0].innerHTML = 0;
    scoresElem[1].innerHTML = 0;

    startGame();
}

function startGame() {
    // Reset game parameters
    for (let i = 0; i < fieldsElem.length; i++) {
        fieldsElem[i].setAttribute("aria-label", "");
        fieldsElem[i].removeAttribute("disabled");
    }

    // Choose starting player
    if (Math.random() < 0.5) {
        // Computer starts
        gameHintElem.innerHTML = "You're player " + player + ". Waiting for player " + computer + "'s turn.";
        disableAllFields();
        setTimeout(function() { computerTurn(); }, delay);
    } else {
        // Player starts
        gameHintElem.innerHTML = "You're player " + player + ". It's your turn.";
    }
}

function disableAllFields() {
    for (let i = 0; i < fieldsElem.length; i++) {
        fieldsElem[i].setAttribute("disabled", "disabled");
    }
}

function enableRemainingFields() {
    for (let i = 0; i < fieldsElem.length; i++) {
        if (fieldsElem[i].getAttribute("aria-label") === "") {
            fieldsElem[i].removeAttribute("disabled");
        }
    }
}

function hoverEffectIn(e) {
    e.target.setAttribute("aria-label", "hover" + player);
}

function hoverEffectOut(e) {
    e.target.setAttribute("aria-label", "");
}

function playerTurn(e) {
    disableAllFields();

    let field = e.target;
    field.setAttribute("aria-label", player);

    let isWinnerExisting = checkWinner();
    let isFinished = checkFinished();

    if (!isWinnerExisting && !isFinished) {
        // It's computer's turn now
        gameHintElem.innerHTML = "Waiting for player " + computer + "'s turn.";
        setTimeout(function() { computerTurn(); }, delay);
    }
}

function computerTurn() {
    computerRandom();

    let isWinnerExisting = checkWinner();
    let isFinished = checkFinished();

    if (!isWinnerExisting && !isFinished) {
        // It's player's turn now
        gameHintElem.innerHTML = "It's your turn.";
        enableRemainingFields();
    }
}

function computerRandom() {
    let turnFinished = false,
        fieldId;
    while (!turnFinished) {
        fieldId = Math.floor(Math.random() * 9);
        if (fieldsElem[fieldId].getAttribute("aria-label") === "") {
            fieldsElem[fieldId].setAttribute("aria-label", computer);
            turnFinished = true;
        }
    }
}

function checkWinner() {
    let winner = "";

    for (let i = 0; i < 3; i++) {
        // Vertical
        if (fieldsElem[i].getAttribute("aria-label") !== ""
            && fieldsElem[i].getAttribute("aria-label") === fieldsElem[3 + i].getAttribute("aria-label")
            && fieldsElem[3 + i].getAttribute("aria-label") === fieldsElem[6 + i].getAttribute("aria-label")) {
            winner = fieldsElem[i].getAttribute("aria-label");
            break;
        }

        // Horizontal
        if (fieldsElem[i*3].getAttribute("aria-label") !== ""
            && fieldsElem[i*3].getAttribute("aria-label") === fieldsElem[i*3+1].getAttribute("aria-label")
            && fieldsElem[i*3+1].getAttribute("aria-label") === fieldsElem[i*3+2].getAttribute("aria-label")) {
            winner = fieldsElem[i*3].getAttribute("aria-label");
            break;
        }
    }

    if (winner === "") {
        // Diagonal top left to bottom right
        if (fieldsElem[0].getAttribute("aria-label") !== ""
            && fieldsElem[0].getAttribute("aria-label") === fieldsElem[4].getAttribute("aria-label")
            && fieldsElem[4].getAttribute("aria-label") === fieldsElem[8].getAttribute("aria-label")) {
            winner = fieldsElem[0].getAttribute("aria-label");
        }

        // Diagonal top right to bottom left
        else if (fieldsElem[2].getAttribute("aria-label") !== ""
            && fieldsElem[2].getAttribute("aria-label") === fieldsElem[4].getAttribute("aria-label")
            && fieldsElem[4].getAttribute("aria-label") === fieldsElem[6].getAttribute("aria-label")) {
            winner = fieldsElem[2].getAttribute("aria-label");
        }
    }

    if (winner === player) {
        gameHintElem.innerHTML = "Congratulations, you have won!"
        scores[0]++;
        scoresElem[0].innerHTML = scores[0];
    } else if (winner === computer) {
        gameHintElem.innerHTML = "Oh no, you have lost!"
        scores[1]++;
        scoresElem[1].innerHTML = scores[1];
    }

    return winner !== "";
}

function checkFinished() {
    let gridIsFull = true;

    // Check if grid is full
    for (let i = 0; i < fieldsElem.length; i++) {
        if (fieldsElem[i].getAttribute("aria-label") === "") {
            gridIsFull = false;
            break;
        }
    }

    if (gridIsFull) {
        gameHintElem.innerHTML = "It's a draw."
    }

    return gridIsFull;
}

function restart() {
    startGame();
}

function menu() {
    window.open("../menu/menu.html", "_self");
}