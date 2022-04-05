window.addEventListener("load", () => {
     username = document.getElementById("username");
     password = document.getElementById("password");
     btnLogin = document.getElementById("login");
     errorWrong = document.getElementById("errorWrong");
     errorEmptyUsername = document.getElementById("errorEmptyUsername");
     errorEmptyPassword = document.getElementById("errorEmptyPassword");

    btnLogin.addEventListener("click", login);
});

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
    let response = await fetch('http://localhost:3000/login',
        {
            method: 'POST',
            body: userJson
        }).catch((error) => {
        console.error('Error:', error);
        isError = true;
    });



    console.log(response);

    if (response.statusCode===200) {
        errorWrong.style.display = "none";
        errorEmptyUsername.style.display = "none";
        errorEmptyPassword.style.display = "none";
        window.open("../menu/menu.html", "_self");
    } else {
        errorWrong.style.display = "block";
        errorEmptyUsername.style.display = "none";
        errorEmptyPassword.style.display = "none";
    }
}