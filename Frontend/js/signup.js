const username_inp = document.getElementById('username')
const username_err = document.getElementById("username_err");
const email_inp = document.getElementById('email')
const email_err = document.getElementById("email_err");
const password_inp = document.getElementById("password");
const password_err = document.getElementById("password_err");
const confirmPassword_inp = document.getElementById("confirmPassword");
const confirmPassword_err = document.getElementById("confirmPassword_err");
const general_err = document.getElementById("general_err");
const signup_btn = document.getElementById('signup_btn')

const socket = io("http://localhost:5050");


signup_btn.addEventListener('click', async () => {
    username_err.innerHTML = "";
    email_err.innerHTML = "";
    password_err.innerHTML = "";
    confirmPassword_err.innerHTML = "";

    const res = await axios.post("http://localhost:5050/user/signup", {
        username: username_inp.value,
        email: email_inp.value,
        password: password_inp.value,
        confirmPassword: confirmPassword_inp.value,
    });

    if (res.data.message == "Validation Errors") {
        if (res.data.validationResult.includes("username")) {
            username_err.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                username length must be at least 6 and <= 20, 
                and it should contain characters and numbers only.
            `;
        }

        if (res.data.validationResult.includes("email")) {
            email_err.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                please enter valid email.
            `;
        }

        if (res.data.validationResult.includes("password")) {
            password_err.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                password length must be at least 6.
            `;
        }

        if (res.data.validationResult.includes("confirmPassword")) {
            confirmPassword_err.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                confirmPassword must match password value.
            `;
        }
    } 
    
    else if (res.data.message == "signup done") {
        socket.emit('signup', 'signup')
        username_inp.value = "";
        username_err.innerHTML = "";
        email_inp.value = "";
        email_err.innerHTML = "";
        password_inp.value = "";
        password_err.innerHTML = "";
        confirmPassword_inp.value = "";
        confirmPassword_err.innerHTML = "";
        window.location.href = "../../Frontend/login.html";
    } 

    else if ((res.data.message = "username or email already exist")) {
        general_err.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            username or email already exist.
        `;
    }
    
})