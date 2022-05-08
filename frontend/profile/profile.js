usernameElem = document.getElementById("username");
errorUsernameElem = document.getElementById("errorUsername")
document.getElementById("saveUsername").addEventListener("click", saveUsername);
document.getElementById("discardUsername").addEventListener("click", discardUsername);
document.getElementById("menu").addEventListener("click", menu);

getUsername();

async function getUsername() {
    // Get username from webserver
    let sessionJson = JSON.parse('{ "sessionkey": "' + user.session_key + '" }');
    await fetch('http://localhost:3000/getName', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(sessionJson),
    })
        .then(async function (data) {
            usernameElem.value = await data.text();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function saveUsername() {
    // Check input
    if (usernameElem.value === "") {
        errorUsernameElem.style.display = "block";
        return;
    } else {
        errorUsernameElem.style.display = "none";

        let userJson = JSON.parse('{ "sessionkey": "' + user.session_key + '", "username": "' + usernameElem.value + '" }');
        console.log(userJson);
        await fetch('http://localhost:3000/setName',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userJson)
            }).catch((error) => {
                console.error('Error:', error);
                isError = true;
            });
    }
}

function discardUsername() {
    getUsername();
}

function menu() {
    location.href = "#/menu/";
}