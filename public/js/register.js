/**
 * User Controller
 */

const UserController = (() => {

    return {

        // Create

        create: async function(user) {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const body = JSON.stringify({
                name: user.name.value,
                email: user.email.value,
                password: user.password.value,
            })

            const requestOptions = {
                headers: myHeaders,
                method: 'POST',
                body: body,
                redirect: 'follow'
            }

            const res = await fetch('/users', requestOptions);

            if (res.status !== 201) {

                return 'error';
            }

            // const result = await res.json();
            return 'success';

            // location.replace('/login')
        }
    }
})()

/**
 * User UI Controller
 */

const UserUIController = (() => {
    const DOMRegStrings = {
        formReg: 'form-reg',
        nameReg: 'name-reg',
        emailReg: 'email-reg',
        passwordReg: 'password-reg',
        password2Reg: 'password2-reg',
        result: '.result',
        setting: '.setting'
    }

    return {

        // Get DOMRegStrings

        getDOMRegStrings: function() {
            return DOMRegStrings;
        },

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

            const p = document.querySelector(DOMRegStrings.result);
            console.log(p);
            p.className = 'result message';
            p.innerText = msg;
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

        validateReg: function(DOMReg) {

            const name = document.getElementById(DOMReg.nameReg)
            const email = document.getElementById(DOMReg.emailReg);
            const password = document.getElementById(DOMReg.passwordReg);
            const password2 = document.getElementById(DOMReg.password2Reg);

            const ckRequired = this.checkRequired([name, email, password, password2]);
            if (!ckRequired) {
                return null;
            }

            const ckLengthEmail = this.checkLength(email, 5, 40);
            if (!ckLengthEmail) {
                return null;
            }

            const ckPass = this.checkPassword(password, password2);
            const ckLengName = this.checkLength(name, 2, 30);
            const ckLengthPass = this.checkLength(password, 4, 30);
            const ckLengthPass2 = this.checkLength(password2, 4, 30);
            const ckEmail = this.validateEmail(email);
            const result = ckPass && ckLengName && ckLengthPass && ckEmail && ckLengthPass2;

            if (result === false) {

                return null;
            }

            return {
                name,
                email,
                password,
                password2
            }
        }

        // Directo
    }
})()

/**
 * User App Controller
 */

const UserAppController = ((UserCtrl, UICtrl) => {

    // Get DOM Register page

    const DOMReg = UICtrl.getDOMRegStrings();

    // Setup Event

    const setupEventListeners = () => {

        document.querySelector(DOMReg.setting).addEventListener('click', () => {
            location.assign('/');
        })
        document.getElementById(DOMReg.formReg).addEventListener('submit', register);

    }

    // Register

    const register = async function(event) {
        event.preventDefault();

        let user, message;

        // Validate value input

        user = UICtrl.validateReg(DOMReg);

        if (user == null) {

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

    // RETURN

    return {
        init: function() {
            setupEventListeners()
        }
    }
})(UserController, UserUIController)

// RUN 
UserAppController.init();