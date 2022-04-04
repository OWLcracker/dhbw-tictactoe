let usernameElem,
    errorUsernameElem,
    currentPasswordElem,
    newPasswordElem,
    newPasswordRepeatElem,
    errorPasswordElem;

let username = "Jonas",
    password;

window.addEventListener("load", () => {
    usernameElem = document.getElementById("username");
    usernameElem.value = username;
    errorUsernameElem = document.getElementById("errorUsername")
    currentPasswordElem = document.getElementById("currentPassword");
    newPasswordElem = document.getElementById("newPassword");
    newPasswordRepeatElem = document.getElementById("newPasswordRepeat");
    errorPasswordElem = document.getElementById("errorPassword")
    document.getElementById("saveUsername").addEventListener("click", saveUsername);
    document.getElementById("discardUsername").addEventListener("click", discardUsername);
    document.getElementById("savePassword").addEventListener("click", savePassword);
    document.getElementById("discardPassword").addEventListener("click", discardPassword);
    document.getElementById("menu").addEventListener("click", menu);
});

function saveUsername() {
    // Check input
    if (usernameElem.value === "") {
        errorUsernameElem.style.display = "block";
        return;
    } else {
        errorUsernameElem.style.display = "none";
        username = usernameElem.value;
    }
}

function discardUsername() {
    usernameElem.value = username;
}

function savePassword() {
    // Check input
    if (currentPasswordElem.value === "" || newPasswordElem.value === "" || newPasswordRepeatElem.value === ""
        || newPasswordElem.value !== newPasswordRepeatElem.value) {
        errorPasswordElem.style.display = "block";
        return;
    } else {
        errorPasswordElem.style.display = "none";
        password = newPasswordElem.value;
        discardPassword();
    }
}

function discardPassword() {
    currentPasswordElem.value = "";
    newPasswordElem.value = "";
    newPasswordRepeatElem.value = "";
}

function menu() {
    window.open("../menu/menu.html", "_self");
}