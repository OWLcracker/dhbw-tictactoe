let usernameElem,
    passwordElem,
    passwordRepeatElem,
    errorElem,
    pwBar;

let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|' +
    '((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))|' +
    '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}))');
window.addEventListener("load", () => {
    usernameElem = document.getElementById("username");
    pwBar = document.getElementById("password-bar");
    passwordElem = document.getElementById("password");
    passwordElem.addEventListener("input", check);
    passwordRepeatElem = document.getElementById("passwordRepeat");
    errorElem = document.getElementById("error");
    document.getElementById("register").addEventListener("click", register);
});
function check(){
    if(passwordElem.value===""){
        pwBar.style.display = "none"
    }
    else if(strongPassword.test(passwordElem.value)){
        pwBar.style.display = "block"
        pwBar.style.backgroundColor = "green";
    }
    else if (mediumPassword.test(passwordElem.value)){
        pwBar.style.display = "block"
        pwBar.style.backgroundColor  = "orange";
    }
    else{
        pwBar.style.display = "block"
        pwBar.style.backgroundColor  = "red";
    }
}
async function register() {
    // Check input
    if (usernameElem.value === "" || passwordElem.value === "" || passwordRepeatElem.value === ""
        || passwordElem.value !== passwordRepeatElem.value) {
        errorElem.innerHTML = "Error. Please enter a valid username &amp; password.";
        errorElem.style.display = "block";
        return;
    }
    else if(!strongPassword.test(passwordElem.value)) {
        errorElem.innerHTML = "Error. Your password must contain at least 8 characters, 1 uppercase letter, " +
                                "1 lowercase letter, 1 digit and 1 special character.";
        errorElem.style.display = "block";
        return;
    }
    else {
        errorElem.style.display = "none";

        let userJson = JSON.parse('{ "user": "' + username.value + '", "password": "' + password.value + '" }');
        let isError = false;
        let response = await fetch('http://localhost:3000/register',
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
        if (isError||response.status===400) {
            errorElem.innerHTML = 'Error. Please try again later.';
            errorElem.style.display = "block";
        }
        else if (response.status===200) {
            window.open("../menu/menu.html", "_self");
        } else if (response.status===406) {
            errorElem.innerHTML = 'Error. User already exists.'
            errorElem.style.display = "block";
        }
    }
}