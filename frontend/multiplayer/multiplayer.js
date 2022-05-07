    gameHintElem = document.getElementById("gameHint");
    scoresElem = document.querySelectorAll(".scoreValue")
    fieldsElem = document.querySelectorAll("#grid button");
    restartElem = document.getElementById("restart");

    grid = document.getElementById("grid");
    grid.addEventListener("mouseover", hoverEffectIn);
    grid.addEventListener("mouseout", hoverEffectOut);
    grid.addEventListener("click", playerTurn);

    restartElem.addEventListener("click", restart);
    document.getElementById("menu").addEventListener("click", menu);

    initSocket();

    restartElem.disabled = true;
    disableAllFields();
    gameHintElem.innerHTML = "Waiting for opponent to connect...";

function initSocket() {
    socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = function(e) {
        console.log('Socket connection established successfully.');
        socket.send('QUEUE');
        console.log('Waiting for opponent to connect...');
    }

    socket.onmessage = function(event) {
        const msg = event.data.toString();

        if (msg === 'start_p1' || msg === 'start_p2') {
            isStartingPlayer = msg === 'start_p1';
            initGame();
            startGame();
        } else if (msg.startsWith('move:')) {
            opponentTurn(parseInt(msg.charAt(5)));
        } else if (msg === 'restart') {
            if (!playerIsWaitingForRestart) {
                opponentIsWaitingForRestart = true;
                gameHintElem.innerHTML = "Your opponents wants a re-match. Do you want to restart?";
            } else {
                playerIsWaitingForRestart = false;
                startGame();
            }
        } else if (msg === 'stop') {
            disableAllFields();

            // Check if game was running
            if (restartElem.disabled) {
                gameHintElem.innerHTML = "Opponent disconnected. You've won.";
                scores[0]++;
                scoresElem[0].innerHTML = scores[0];
            } else {
                gameHintElem.innerHTML = "Opponent disconnected.";
                restartElem.disabled = true;
            }
        }
    }

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log('Socket connection was closed cleanly.');
        } else {
            console.error('Socket connection died.');
        }
    }

    socket.onerror = function(e) {
        console.log('Socket error.', e);
    }
}

function initGame() {
    scores = [0, 0];

    // Assign symbol to player
    let scoresLabelElem = document.querySelectorAll(".scoreLabel");
    if (isStartingPlayer) {
        player = 'x';
        opponent = 'o';
    } else {
        player = 'o';
        opponent = 'x';
    }

    scoresLabelElem[0].innerHTML = "Score " + player + ":";
    scoresLabelElem[1].innerHTML = "Score " + opponent + ":";
    scoresElem[0].innerHTML = 0;
    scoresElem[1].innerHTML = 0;

    disableAllFields();

    console.log('Game initialization finished.');
}

function startGame() {
    // Reset game parameters
    restartElem.disabled = true;
    for (let i = 0; i < fieldsElem.length; i++) {
        fieldsElem[i].setAttribute("aria-label", "");
    }

    console.log('Game has started.');

    if (isStartingPlayer) {
        // Player starts
        gameHintElem.innerHTML = "You're player " + player + ". It's your turn.";
        enableRemainingFields();
    } else {
        // Opponent starts
        gameHintElem.innerHTML = "You're player " + player + ". Waiting for player " + opponent + "'s turn.";
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

    socket.send('move:' + field.className);

    let isWinnerExisting = checkWinner();
    let isFinished = checkFinished();

    if (!isWinnerExisting && !isFinished) {
        // It's opponent's turn now
        gameHintElem.innerHTML = "Waiting for player " + opponent + "'s turn.";
    } else {
        // Game has ended
        restartElem.disabled = false;
    }
}

function opponentTurn(field) {
    fieldsElem[field].setAttribute("aria-label", opponent);

    let isWinnerExisting = checkWinner();
    let isFinished = checkFinished();

    if (!isWinnerExisting && !isFinished) {
        // It's player's turn now
        gameHintElem.innerHTML = "It's your turn.";
        enableRemainingFields();
    } else {
        // Game has ended
        restartElem.disabled = false;
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
    } else if (winner === opponent) {
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
    // Change starting player when restarting
    isStartingPlayer = !isStartingPlayer;

    socket.send('restart');
    if (opponentIsWaitingForRestart) {
        opponentIsWaitingForRestart = false;
        startGame();
    } else {
        playerIsWaitingForRestart = true;
        gameHintElem.innerHTML = "Waiting for opponent...";
    }
}

function menu() {
    socket.send('stop');
    location.href = "#/menu/";
}