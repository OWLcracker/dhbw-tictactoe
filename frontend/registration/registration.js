
    strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
    mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|' +
    '((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))|' +
    '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}))');
    usernameElem = document.getElementById("username");
    pwBar = document.getElementById("password-bar");
    passwordElem = document.getElementById("password");
    passwordRepeatElem = document.getElementById("passwordRepeat");
    errorElem = document.getElementById("error");
    regBtn =  document.getElementById("register");

    usernameElem.addEventListener("keypress", enterRegister);
    passwordElem.addEventListener("input", check);
    passwordElem.addEventListener("keypress", enterRegister);
    passwordRepeatElem.addEventListener("keypress", enterRegister);
    regBtn.addEventListener("click", register);
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
    }
    else if(!strongPassword.test(passwordElem.value)) {
        errorElem.innerHTML = "Error. Your password must contain at least 8 characters, 1 uppercase letter, " +
                                "1 lowercase letter, 1 digit and 1 special character.";
        errorElem.style.display = "block";
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
            location.href = "#/menu/";
        } else if (response.status===406) {
            errorElem.innerHTML = 'Error. User already exists.'
            errorElem.style.display = "block";
        }
    }
}

function enterRegister(){
    if(event.key ==="Enter"){
        register();
    }
}