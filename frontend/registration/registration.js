let usernameElem,
    passwordElem,
    passwordRepeatElem,
    errorElem;

window.addEventListener("load", () => {
    usernameElem = document.getElementById("username");
    passwordElem = document.getElementById("password");
    passwordRepeatElem = document.getElementById("passwordRepeat");
    errorElem = document.getElementById("error");
    document.getElementById("register").addEventListener("click", register);
});

async function register() {
    // Check input
    if (usernameElem.value === "" || passwordElem.value === "" || passwordRepeatElem.value === ""
        || passwordElem.value !== passwordRepeatElem.value) {
        errorElem.style.display = "block";
        return;
    } else {
        errorElem.style.display = "none";

        // TODO Send user object to backend
        let userJson = "{ \"user\": \"" + usernameElem.value + "\", \"password\": \"" + passwordElem.value + "\" }"
        response = await fetch('http://localhost:3000/register',
            {
                method: 'POST',
                body: userJson
            });

        console.log(response);


        //window.open("../menu/menu.html", "_self");
    }
}