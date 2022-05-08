window.addEventListener('popstate', function (event) {
    if (!(socket.readyState === WebSocket.CLOSING || socket.readyState === WebSocket.CLOSED)) {
        socket.send('stop');
        socket.close();
    }
});

gameHintElem = document.getElementById("gameHint");
scoresElem = document.querySelectorAll(".scoreValue");
fieldsElem = document.querySelectorAll("#grid button");
restartElem = document.getElementById("restart");

grid = document.getElementById("grid");
grid.addEventListener("mouseover", hoverEffectIn);
grid.addEventListener("mouseout", hoverEffectOut);
grid.addEventListener("click", playerTurn);

opponentIsWaitingForRestart = playerIsWaitingForRestart = false;

restartElem.addEventListener("click", restart);
document.getElementById("menu").addEventListener("click", menu);

initSocket();

restartElem.disabled = true;
disableAllFields();
gameHintElem.innerHTML = "Waiting for opponent to connect...";

function initSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = async function (e) {
        console.log('Socket connection established successfully.');

        // Get username from webserver
        session_key = '9a6c2b88-ea60-43cd-bf93-3bb438e61f9f';
        let sessionJson = JSON.parse('{ "sessionkey": "' + session_key + '" }');
        await fetch('http://localhost:3000/getName', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(sessionJson),
            })
            .then(async function(data) {
                p1Username = await data.text();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // Authenticate socket on websocket server
        socket.send('SESSION:' + session_key);
    }

    socket.onmessage = function (event) {
        const msg = event.data.toString();

        if (msg === 'Authenticated') {
            socket.send('QUEUE');
            console.log('Waiting for opponent to connect...');
        } else if (msg.startsWith('start_p1') || msg.startsWith('start_p2')) {
            isStartingPlayer = msg.startsWith('start_p1');

            p2Username = msg.substring(8);

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
                gameHintElem.innerHTML = p2Username + " disconnected. You've won.";
                scores[0]++;
                scoresElem[0].innerHTML = scores[0];
            } else {
                gameHintElem.innerHTML = p2Username + " disconnected.";
                restartElem.disabled = true;
            }
        }
    }

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log('Socket connection was closed cleanly.');
        } else {
            console.error('Socket connection died.');
        }
    }

    socket.onerror = function (e) {
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

    scoresLabelElem[0].innerHTML = p1Username;
    scoresLabelElem[1].innerHTML = p2Username;
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
        gameHintElem.innerHTML = "You're player " + player + ". Waiting for player " + p2Username + "'s turn.";
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
        gameHintElem.innerHTML = "Waiting for player " + p2Username + "'s turn.";
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
        if (fieldsElem[i * 3].getAttribute("aria-label") !== ""
            && fieldsElem[i * 3].getAttribute("aria-label") === fieldsElem[i * 3 + 1].getAttribute("aria-label")
            && fieldsElem[i * 3 + 1].getAttribute("aria-label") === fieldsElem[i * 3 + 2].getAttribute("aria-label")) {
            winner = fieldsElem[i * 3].getAttribute("aria-label");
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
        gameHintElem.innerHTML = "Waiting for player " + p2Username + "...";
    }
}

function menu() {
    socket.send('stop');
    socket.close();
    location.href = "#/menu/";
}