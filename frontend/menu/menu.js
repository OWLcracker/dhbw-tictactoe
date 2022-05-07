window.addEventListener("load", () => {
    document.getElementById("singleplayer").addEventListener("click", singleplayer);
    document.getElementById("multiplayer").addEventListener("click", multiplayer);
    document.getElementById("history").addEventListener("click", history);
    document.getElementById("profile").addEventListener("click", profile);
    document.getElementById("logout").addEventListener("click", logout);
});

function singleplayer() {
    window.open("../game/game.html", "_self");
}

function multiplayer() {
    window.open("../multiplayer/multiplayer.html", "_self");
}

function history() {
    window.open("../history/history.html", "_self");
}

function profile() {
    window.open("../profile/profile.html", "_self");
}

function logout() {
    window.open("../login/login.html", "_self");
}