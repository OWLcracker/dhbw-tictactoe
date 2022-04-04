window.addEventListener("load", () => {
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let btnLogin = document.getElementById("login");
    let errorWrong = document.getElementById("errorWrong");
    let errorEmptyUsername = document.getElementById("errorEmptyUsername");
    let errorEmptyPassword = document.getElementById("errorEmptyPassword");

    btnLogin.addEventListener("click", login);
});

function login() {
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

    // TODO Check if account is existing
    let success = true;

    if (success) {
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