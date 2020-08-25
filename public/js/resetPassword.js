/**
 * User Controller
 */
const UserController = (() => {

    return {

        // Reset
        resetPassword: async(password) =>{
            const myHeaders = new Headers() 
            myHeaders.append("Content-Type", "application/json") 
            const body = JSON.stringify({
                password
            })

            const requestOptions = {
                headers: myHeaders,
                method: 'PATCH',
                body: body,
                redirect: 'follow'
            }

            const res = await fetch('/users/changePasswordReset', requestOptions)
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
        formReset: '#form-reset',
        passwordNew: '#password-new',
        passwordNew2: '#password-new2',
    }

    return {

        // Get DOMLogStrings 
        getDOMStrings: function() {
            return DOMStrings
        },

        // Validate Reg
        getPassword: function() {

            const password = document.querySelector(DOMStrings.passwordNew) 
            const password2= document.querySelector(DOMStrings.passwordNew2) 

            const ckRequired = checkRequired([password, password2])
            if (!ckRequired) {
                return null 
            }

            const ckLengthPass = checkLength(password, 4, 30) 
            const ckLengthPass2 = checkLength(password2, 4, 30) 
            const ckSame = checkPassword(password,password2)

            const result = ckLengthPass && ckLengthPass2 && ckSame
            if (result === false) {
                return null 
            }

            return password.value
                
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
        document.querySelector(DOM.formReset).addEventListener('submit',resetPassword)

    }

    // Reset password
    const resetPassword = async(e)=>{

        e.preventDefault()

        const password = UICtrl.getPassword()

        if(password === null) {
            return
        }
        console.log(password);
        const result = await UserCtrl.resetPassword(password)

        if(result === 'error') {

            showResult('Reset Mật Khẩu Thất Bại')
        
        } else {

            showResult('Reset Mật Khẩu Thành Công')
        }

        setTimeout(()=>{
            location.assign('/')
        }, 4000)
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