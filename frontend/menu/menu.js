
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
    location.href = "#/history/";
}

function profile() {
    location.href = "#/profile/";
}

function logout() {
    resetSession();
    location.href = "#/login/";
}