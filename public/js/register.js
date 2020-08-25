/**
 * User Controller
 */
const UserController = (() => {

    return {

        // Create
        create: async function(user) {
console.log(user);
            const myHeaders = new Headers()  
            myHeaders.append("Content-Type", "application/json")  

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

            const res = await fetch('/users', requestOptions)  

            if (res.status !== 201) {

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
            return DOMRegStrings  
        },

        // Get DOMLogStrings 
        getDOMLogStrings: function() {
            return DOMLogStrings  
        },

        // Validate Reg
        validateReg: function(DOMReg) {

            const name = document.getElementById(DOMReg.nameReg)
            const email = document.getElementById(DOMReg.emailReg)  
            const password = document.getElementById(DOMReg.passwordReg)  
            const password2 = document.getElementById(DOMReg.password2Reg)  

            const ckRequired = checkRequired([name, email, password, password2])  
            if (!ckRequired) {
                return null  
            }

            const ckLengthEmail = checkLength(email, 5, 40)  
            if (!ckLengthEmail) {
                return null  
            }

            const ckPass = checkPassword(password, password2)  
            const ckLengName = checkLength(name, 2, 30)  
            const ckLengthPass = checkLength(password, 4, 30)  
            const ckLengthPass2 = checkLength(password2, 4, 30)  
            const ckEmail = validateEmail(email)  
            const result = ckPass && ckLengName && ckLengthPass && ckEmail && ckLengthPass2  

            if (result === false) {

                return null  
            }

            return {
                name,
                email,
                password,
                password2
            }
        }
    }
})()

/**
 * User App Controller
 */
const UserAppController = ((UserCtrl, UICtrl) => {

    // Get DOM Register page
    const DOMReg = UICtrl.getDOMRegStrings()  

    // Setup Event
    const setupEventListeners = () => {

        document.querySelector(DOMReg.setting).addEventListener('click', () => {
            location.assign('/')  
        })
        document.getElementById(DOMReg.formReg).addEventListener('submit', register)  
    }

    // Register

    const register = async function(event) {
        event.preventDefault()  

        let user, message  

        // Validate value input

        user = UICtrl.validateReg(DOMReg)  

        if (user === null) {

            return  
        }

        // Create new user    
        message = await UserCtrl.create(user)  
        console.log(message);
        // Show message
        if (message === 'error') {
            showError(user.email, 'Email đã có người sử dụng')  
            return  

        }
        showResult('Đăng kí thành công. Đăng nhập để bắt đầu')  

        // Change url
        setTimeout(() => {
            location.replace('/login')  
        }, 2000)  
    }

    // RETURN

    return {
        init: function() {
            setupEventListeners()
        }
    }
})(UserController, UserUIController)

// RUN 
UserAppController.init()  