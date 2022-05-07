window.addEventListener("load", () => {
    username = document.getElementById("username");
    password = document.getElementById("password");
    btnLogin = document.getElementById("login");
    errorWrong = document.getElementById("errorWrong");
    errorEmptyUsername = document.getElementById("errorEmptyUsername");
    errorEmptyPassword = document.getElementById("errorEmptyPassword");

    btnLogin.addEventListener("click", login);
    username.addEventListener("keypress", enterLogin);
    password.addEventListener("keypress", enterLogin);
});

async function login() {
    // Check input user and pasword are not empty
    errorWrong.style.display = "none";
    if (username.value === "") {
        errorEmptyUsername.style.display = "block";
        errorEmptyPassword.style.display = "none";
        return;
    } else if (password.value === "") {
        errorEmptyPassword.style.display = "block";
        errorEmptyUsername.style.display = "none";
        return;
    }

    const userJson = JSON.parse('{ "user": "' + username.value + '", "password": "' + password.value + '" }');
    console.log(userJson);

    let isErrorLogin = false;
    const response = await fetch('http://localhost:3000/login', 
        {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(userJson),
        })
        .catch((e) => {
            console.error('Error user logging in:', e);
            isErrorLogin = true;
        });
    console.log(response);

    errorEmptyUsername.style.display = "none";
    errorEmptyPassword.style.display = "none";
    if (!isErrorLogin && response.status === 200) {
        window.open("../menu/menu.html", "_self");
    } else {
        errorWrong.style.display = "block";
    }
}

function enterLogin(){
    if(event.key === "Enter"){
        login();
    }
}