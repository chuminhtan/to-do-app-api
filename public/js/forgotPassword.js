/**
 * User Controller
 */
const UserController = (() => {

    return {

        // Require reset password
        requireResetPassword: async(email) =>{
            const myHeaders = new Headers() 
            myHeaders.append("Content-Type", "application/json") 
            const body = JSON.stringify({
                email
            })

            const requestOptions = {
                headers: myHeaders,
                method: 'POST',
                body: body,
                redirect: 'follow'
            }

            const res = await fetch('/users/forgotPassword', requestOptions)
            console.log(res.status);
            
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

    const DOMStrings = {
        form: '#form-forgot',
        email: '#email-forgot',
    }

    return {

        // Get DOMLogStrings 
        getDOMStrings: function() {
            return DOMStrings
        },

        // Validate Reg
        getEmail: function() {

            const email = document.querySelector(DOMStrings.email) 

            const ckRequired = checkRequired([email])
            if (!ckRequired) {
                return null 
            }

            const ckLengthEmail = checkLength(email, 5, 30) 
            const ckEmail = validateEmail(email)
            const result = ckLengthEmail && ckEmail
            if (result === false) {
                return null 
            }

            return email.value
                
        }
    }
})()

/**
 * User App Controller
 */

const AppController = ((UserCtrl, UICtrl) => {

    // Get DOM Login page
    const DOM = UICtrl.getDOMStrings() 

    // Setup Event
    const setupEventListeners = () => {
        document.querySelector(DOM.form).addEventListener('submit',requireResetPassword)

    }

    // Require Reset Password
    const requireResetPassword = async(e)=>{

        e.preventDefault()

        const email = UICtrl.getEmail()

        if(email === null) {
            return
        }
        console.log(email);
        const result = await UserCtrl.requireResetPassword(email)
console.log(result)
        showResult('Đã Gửi Đường Dẫn Reset Mật Khẩu Vào Hòm Thư Của Bạn. Vui lòng kiểm tra.')

        setTimeout(()=>{
            location.assign('/')
        }, 10000)
    }


    // RETURN
    return {
        init: function() {
            setupEventListeners()
        }
    }
})(UserController, UserUIController)

// RUN 
AppController.init() 