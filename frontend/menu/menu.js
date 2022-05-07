
    document.getElementById("singleplayer").addEventListener("click", singleplayer);
    document.getElementById("multiplayer").addEventListener("click", multiplayer);
    document.getElementById("history").addEventListener("click", history);
    document.getElementById("profile").addEventListener("click", profile);
    document.getElementById("logout").addEventListener("click", logout);

function singleplayer() {
    location.href = "#/game/";
}

function multiplayer() {
    location.href = "#/multiplayer/";
}

function history() {
    window.open("../history/history.html", "_self");
}

function profile() {
    window.open("../profile/profile.html", "_self");
}

function logout() {
    location.href = "#/login/";
}