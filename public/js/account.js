/**
 * USER CONTROLLER
 */

const UserController = (() => {

    return {

        // Delete User
        delete: async() => {
            const myHeaders = new Headers()  
            myHeaders.append("Content-Type", "application/json")  

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow',
            }  

            const res = await fetch("users/me", requestOptions)

            if(res.status !== 200){
                return 'error'
            }

            return 'success'
        },

        // Logout User
        logout: async() => {

            const myHeaders = new Headers()  
            myHeaders.append("Content-Type", "application/json")  

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
            }  

            const res = await fetch("users/logout", requestOptions)  
        },

        // Read User
        readProfile: async() => {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            }

            const res = await fetch("/users/me", requestOptions)  


            if (res.status != 200) {

                return null  
            }

            return await res.json()  
        },

        // Update Info
        updateInfo: async(user) => {

            const myHeaders = new Headers()  
            myHeaders.append("Content-Type", "application/json")  

            const body = JSON.stringify({
                name: user.name,
                email: user.email
            })

            const requestOptions = {
                headers: myHeaders,
                method: 'PATCH',
                body: body,
                redirect: 'follow'
            }

            const res = await fetch('/users/info', requestOptions)  

            if (res.status !== 200) {

                return null  
            }

            return await res.json()  
        },

        // Update password
        updatePassword: async(objPassword) => {
            const myHeaders = new Headers()  
            myHeaders.append("Content-Type", "application/json")  

            const body = JSON.stringify({
                passwordOld: objPassword.passwordOld,
                passwordNew: objPassword.passwordNew
            })

            const requestOptions = {
                headers: myHeaders,
                method: 'PATCH',
                body: body,
                redirect: 'follow'
            }

            const res = await fetch('/users/password', requestOptions)  

            if (res.status !== 200) {

                return null  
            }

            return await res.json()  
        }
    }
})()

/**
 * UI Controller
 */

const UIController = (() => {

    const DOMstrings = {
        setting: '.setting',
        formDelete: '#form-delete',
        formInfo: '#form-info',
        formPassword: '#form-password',
        name: 'name',
        email: 'email',
        passwordOld: 'password-old',
        passwordNew: 'password-new',
        passwordNew2: 'password-new2',
        result: '.result',
        confirm: '#confirm'
    }  

    // RETURN
    return {

        // Get DOMstrings
        getDOMstrings: function() {
            return DOMstrings  
        },

        // Show profile
        showProfile: function(user) {
            document.getElementById(DOMstrings.name).value = user.name  
            document.getElementById(DOMstrings.email).value = user.email  
        },

        // Show result

        showResult: function(type, msg) {

            let p, form  

            if (type === 'info') {

                form = document.getElementById(DOMstrings.formInfo)  
                p = form.querySelector(DOMstrings.result)  

            } else if (type === 'password') {
                form = document.getElementById(DOMstrings.formPassword)  
                p = form.querySelector(DOMstrings.result)  
            }

            p.className = 'result message'  
            p.innerText = msg  

            setTimeout(() => {
                p.classList.remove('message')  
            }, 4000)  
        },

        // Get and check info
        getInfo: function(emailCurrent) {

            const name = document.getElementById(DOMstrings.name)  
            let email = document.getElementById(DOMstrings.email)  

            const ckRequired = checkRequired([email, name])  
            if (!ckRequired) {
                return null  
            }

            const ckLengthName = checkLength(name, 2, 40)  
            const ckLengthEmail = checkLength(email, 5, 40)  

            if (!ckLengthEmail && ckLengthName) {
                return null  
            }

            const ckEmail = validateEmail(email)  

            if (ckEmail === false) {

                return null  
            }

            if (emailCurrent === email.value.toLowerCase()) {
                email.value = null  
            }

            return {
                name: name.value,
                email: email.value,
            }
        },

        // Get and check password
        getPassword: function() {

            const passwordOld = document.getElementById(DOMstrings.passwordOld)  
            const passwordNew = document.getElementById(DOMstrings.passwordNew)  
            const passwordNew2 = document.getElementById(DOMstrings.passwordNew2)  

            const ckRequired = checkRequired([passwordOld, passwordNew, passwordNew2])  
            const ckLengPassOld = checkLength(passwordOld, 4, 30)  
            const ckLengPassNew = checkLength(passwordNew, 4, 30)  
            const ckDup = checkPassword(passwordNew, passwordNew2)  

            const ck = ckRequired && ckLengPassOld && ckLengPassNew && ckDup  

            if (ck == false) {
                return null  
            }

            return {
                passwordOld: passwordOld.value,
                passwordNew: passwordNew.value
            }
        },

        // Check value confirm
        checkValueConfirm: function() {

            const inputConfirm = document.querySelector(DOMstrings.confirm)
        
            if( inputConfirm.value !== 'DELETE') {
                return false
            }

            return true
        }
    }
})()


/**
 * User App
 */
const UserAppController = ((UserCtrl, UICtrl) => {

    let userCurrent  

    // Get DOM Login page
    const DOM = UICtrl.getDOMstrings()  

    // Setup Event
    const setupEventListeners = () => {
        document.querySelector(DOM.setting).addEventListener('click', logout)  
        document.querySelector(DOM.formInfo).addEventListener('submit', updateInfo)  
        document.querySelector(DOM.formPassword).addEventListener('submit', updatePassword)
        document.querySelector(DOM.formDelete).addEventListener('submit', deleteAccount)
    }

    // Delete Account
    const deleteAccount = async(e) => {
        e.preventDefault()

        // Check value confirm
        const result = UICtrl.checkValueConfirm()
        
        if(result === false) {
            return showAccountResult(DOM.formDelete,'Mã Xác Thực Không Chính Xác')
        }


        const resultDelete = await UserCtrl.delete()

        if(resultDelete === 'error') {
            return showAccountResult(DOM.formDelete,'Lỗi: Xóa không thành công')
        }

        showAccountResult(DOM.formDelete,'Xóa Tài Khoản Thành Công')
        setTimeout(()=> {
            location.assign('/')
        }, 2000)
    }
    // Logout

    const logout = async() => {

        // Remove Jason Web Token

        await UserCtrl.logout()  
        location.assign('/')  
    }

    // Show info user

    const readProfile = async() => {

        // Read profile 
        userCurrent = await UserCtrl.readProfile()

        if (userCurrent == null) {
            return  
        }

        // Show profile
        UICtrl.showProfile(userCurrent)  
    }

    // Update info : NAME AND EMAIL

    const updateInfo = async function(event) {
        event.preventDefault()  

        let info, newInfo  

        // Get input
        info = UICtrl.getInfo(userCurrent.email)  

        if (info == null) {

            UICtrl.showResult('Cập nhật không thành công')
            return  
        }

        // Update info
        newInfo = await UserCtrl.updateInfo(info)  

        if (newInfo == null) {
            showAccountResult(DOM.formInfo,'Cập nhật Email không thành công , Email đã tồn tại')  

            setTimeout(() => {
                location.assign('/account')
            }, 2000)  

            return  
        }

        showAccountResult(DOM.formInfo,'Cập nhật thành công')  

        // Reload page
        setTimeout(() => {

            location.assign('/account')  
        }, 2000)
    }

    // Update password: PASSWORD
    const updatePassword = async function(event) {

        event.preventDefault()  
        let objPassword, user  

        // Get value password
        objPassword = UICtrl.getPassword()  

        if (objPassword == null) {
            return  
        }

        // Update password
        user = await UserCtrl.updatePassword(objPassword)  

        if (user == null) {
            return showAccountResult(DOM.formPassword, 'Mật khẩu hiện tại không chính xác')  
        }

        showAccountResult(DOM.formPassword, 'Cập nhật mật khẩu thành công')  

        setTimeout(() => {
            location.assign('/account')  
        }, 2000)  
    }

    // RETURN
    return {
        init: function() {
            setupEventListeners()  
            readProfile()  
        }
    }
})(UserController, UIController)

// RUN 
UserAppController.init()  