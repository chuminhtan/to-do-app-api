/**
 * User Controller
 */

const UserController = (() => {

    return {

        // Login

        login: async(user) => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const body = JSON.stringify({
                email: user.email.value,
                password: user.password.value
            })

            const requestOptions = {
                headers: myHeaders,
                method: 'POST',
                body: body,
                redirect: 'follow'
            }

            const res = await fetch('/users/login', requestOptions)

            if (res.status !== 200) {
                return 'error'
            }

            return 'success'
        }

    }
})()

/**
 * User UI Controller
 */

const UserUIController = (() => {

    const DOMLogStrings = {
        formLog: 'form-log',
        emailLog: 'email-log',
        passwordLog: 'password-log',
        result: '.result',
        setting: '.setting'
    }

    return {

        // Get DOMLogStrings 

        getDOMLogStrings: function() {
            return DOMLogStrings;
        },


        // Show error message : LOGIN AND REGISTER

        showError: function(input, message) {
            const formControl = input.parentElement;
            formControl.className = 'form-control error';

            const small = formControl.querySelector('small');
            small.innerText = message;
        },

        // Show success message : LOGIN AND REGISTER
        showSuccess: function(input) {
            const formControl = input.parentElement;
            formControl.className = 'form-control success';
        },

        showResult: function(msg) {

            const p = document.querySelector(DOMLogStrings.result);
            p.className = 'result message';
            p.innerText = msg;

            setTimeout(() => {
                p.classList.remove('message');
            }, 5000);
        },

        // Validate email
        validateEmail: function(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const result = re.test(String(email.value).toLowerCase());

            if (!result) {

                this.showError(email, "Email không hợp lệ");
                return false;
            }
            this.showSuccess(email);
            return true;
        },

        // Check length
        checkLength: function(input, min, max) {

            if (input.value.length < min) {

                this.showError(input, `Tối thiểu ${min} kí tự`)
                return false

            } else if (input.value.length > max) {
                this.showError(input, `Tối đa ${max} kí tự`);
                return false;

            } else {
                this.showSuccess(input);
                return true;
            }
        },

        // Check password
        checkPassword: function(pass1, pass2) {

            if (pass1.value !== pass2.value) {

                this.showError(pass2, `Mật khẩu phải trùng nhau`);
                return false;
            } else {
                this.showSuccess(pass2, '')
                return true;
            }
        },

        // Check required
        checkRequired: function(inputArr) {

            const emptyArr = inputArr.filter((input) => {

                if (input.value.trim() === '') {
                    return input;
                }
            });

            console.log(emptyArr);
            if (emptyArr.length > 0) {

                emptyArr.forEach((input) => {
                    this.showError(input, 'Vui lòng điền thông tin');
                })
                return false;
            }

            return true;
        },

        // Validate Reg

        validateReg: function(DOMLog) {

            const email = document.getElementById(DOMLog.emailLog);
            const password = document.getElementById(DOMLog.passwordLog);

            const ckRequired = this.checkRequired([email, password]);
            if (!ckRequired) {
                return null;
            }

            const ckLengthEmail = this.checkLength(email, 5, 40);
            if (!ckLengthEmail) {
                return null;
            }

            const ckLengthPass = this.checkLength(password, 4, 30);
            const ckEmail = this.validateEmail(email);

            const result = ckLengthPass && ckEmail;

            if (result === false) {

                return null;
            }

            return {
                email,
                password,
            }
        }
    }
})()

/**
 * User App Controller
 */

const UserAppController = ((UserCtrl, UICtrl) => {

    // Get DOM Login page

    const DOMLog = UICtrl.getDOMLogStrings();

    // Setup Event

    const setupEventListeners = () => {
        document.querySelector(DOMLog.setting).addEventListener('click', () => {
            location.assign('/');
        })
        document.getElementById(DOMLog.formLog).addEventListener('submit', login);

    }

    // Register

    const register = async function(event) {
        event.preventDefault();

        let user, message;

        // Validate value input

        user = UICtrl.validateReg(DOMReg);

        if (user == null) {

            console.log('user null');
            return;
        }

        // Create new user    

        message = await UserCtrl.create(user);

        // Show message

        if (message === 'error') {
            UICtrl.showError(user.email, 'Email đã có người sử dụng');
            return;

        }
        UICtrl.showResult('Đăng kí thành công. Đăng nhập để bắt đầu');

        // Change url
        setTimeout(() => {
            location.replace('/login');
        }, 2000);
    }

    // Login

    const login = async function(event) {

        event.preventDefault();

        let user, message;

        // Validate value input

        user = UICtrl.validateReg(DOMLog);

        if (user === null) {

            return;
        }

        // Create new user    

        message = await UserCtrl.login(user);

        // Show message

        if (message === 'error') {
            UICtrl.showResult('Đăng nhập không thành công');
            return;

        }
        UICtrl.showResult('Đăng nhập thành công');

        // Change url
        setTimeout(() => {
            location.replace('/list');
        }, 1000);
    }


    // RETURN

    return {
        init: function() {
            setupEventListeners()
        }
    }
})(UserController, UserUIController)

// RUN 
UserAppController.init();