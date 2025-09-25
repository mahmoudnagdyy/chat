const email_inp = document.getElementById("email");
const email_err = document.getElementById("email_err");
const password_inp = document.getElementById("password");
const password_err = document.getElementById("password_err");
const general_err = document.getElementById("general_err");
const login_btn = document.getElementById("login_btn");

const socket = io("http://localhost:5050");


login_btn.addEventListener('click', async () => {

    email_err.innerHTML = "";
    password_err.innerHTML = "";
    general_err.innerHTML = "";

    const res = await axios.post("http://localhost:5050/user/login", {
        email: email_inp.value,
        password: password_inp.value
    });

    if(res.data.message == 'Validation Errors'){
        if(res.data.validationResult.includes('email')){
            email_err.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                Enter Valid Email.
            `;
        }

        if(res.data.validationResult.includes('password')){
            password_err.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                Enter Valid Password
            `;
        }
    }
    
    else if(res.data.message == 'Wrong Email Or Password'){
        password_err.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            Wrong Email Or Password.
        `;
    }

    else if (res.data.message == "user loggedIn") {
        email_inp.value = "";
        email_err.innerHTML = "";
        password_err.innerHTML = "";
        password_inp.value = "";
        sessionStorage.setItem('token', res.data.token)
        window.location.href = '../../Frontend/home.html'
    }

    else{
        general_err.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            ${res.data.message}
        `;
    }

})