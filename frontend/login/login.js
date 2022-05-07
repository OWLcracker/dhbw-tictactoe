    username = document.getElementById("username");
     password = document.getElementById("password");
     btnLogin = document.getElementById("login");
     errorWrong = document.getElementById("errorWrong");
     errorEmptyUsername = document.getElementById("errorEmptyUsername");
     errorEmptyPassword = document.getElementById("errorEmptyPassword");

    btnLogin.addEventListener("click", login);
    username.addEventListener("keypress", enterLogin);
    password.addEventListener("keypress", enterLogin);

async function login() {
    // Check input
    if (username.value === "") {
        errorEmptyUsername.style.display = "block";
        errorWrong.style.display = "none";
        errorEmptyPassword.style.display = "none";
        return;
    } else if (password.value === "") {
        errorEmptyPassword.style.display = "block";
        errorWrong.style.display = "none";
        errorEmptyUsername.style.display = "none";
        return;
    }

    let userJson = JSON.parse('{ "user": "' + username.value + '", "password": "'+ password.value + '" }');
    console.log(userJson);
    let response = await fetch('http://localhost:3000/login',
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

    console.log(response);

    if (response.status===200) {
        errorWrong.style.display = "none";
        errorEmptyUsername.style.display = "none";
        errorEmptyPassword.style.display = "none";
        location.href = "#/menu/";
    } else {
        errorWrong.style.display = "block";
        errorEmptyUsername.style.display = "none";
        errorEmptyPassword.style.display = "none";
    }
}

function enterLogin(){
    if(event.key === "Enter"){
        login();
    }
}