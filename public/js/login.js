/**
 * User Controller
 */
const UserController = (() => {

    return {

        // Login
        login: async(user) => {

            const myHeaders = new Headers() 
            myHeaders.append("Content-Type", "application/json") 

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
            return DOMLogStrings
        },

        // Validate Reg
        validateReg: function(DOMLog) {

            const email = document.getElementById(DOMLog.emailLog) 
            const password = document.getElementById(DOMLog.passwordLog) 

            const ckRequired = checkRequired([email, password]);
            if (!ckRequired) {
                return null 
            }

            const ckLengthEmail = checkLength(email, 5, 40) 
            if (!ckLengthEmail) {
                return null 
            }

            const ckLengthPass = checkLength(password, 4, 30) 
            const ckEmail = validateEmail(email) 

            const result = ckLengthPass && ckEmail 

            if (result === false) {

                return null 
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
    const DOMLog = UICtrl.getDOMLogStrings() 

    // Setup Event
    const setupEventListeners = () => {
        document.querySelector(DOMLog.setting).addEventListener('click', () => {
            location.assign('/') 
        })
        document.getElementById(DOMLog.formLog).addEventListener('submit', login) 

    }

    // Login
    const login = async function(event) {

        event.preventDefault() 

        let user, message 

        // Validate value input
        user = UICtrl.validateReg(DOMLog) 
        console.log(user);
        if (user === null) {
            return 
        }

        // Create new user    
        message = await UserCtrl.login(user) 

        // Show message
        if (message === 'error') {
            showResult('Đăng nhập không thành công') 
            return 

        }
        showResult('Đăng nhập thành công') 
        // Change url
        setTimeout(() => {
            location.replace('/list') 
        }, 1000) 
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