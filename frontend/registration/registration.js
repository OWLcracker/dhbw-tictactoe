window.addEventListener("load", () => {
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let passwordRepeat = document.getElementById("passwordRepeat");
    let btnRegister = document.getElementById("register");
    let error = document.getElementById("error");
    btnRegister.addEventListener("click", register);
});

function register() {
    if (password.value !== passwordRepeat.value) {
        passwordRepeat.setCustomValidity("Passwords don't match.");
        error.style.display = "block";
        return;
    } else {
        passwordRepeat.setCustomValidity("");
        error.style.display = "none";
    }

    let userJson = "{ \"username\": \"" + username.value + "\", \"password\": \"" + password.value + "\" }"
    console.log(userJson);
}