       // Show error message  : LOGIN - REGISTER - ACCOUNT
       const showError = function(input, message) {
        const formControl = input.parentElement 
        formControl.className = 'form-control error' 

        const small = formControl.querySelector('small') 
        small.innerText = message 
    }

    // Show success message : LOGIN - REGISTER - ACCOUNT
    const showSuccess = function(input) {
        const formControl = input.parentElement 
        formControl.className = 'form-control success' 
    }

    // Show result message : LOGIN - REGISTER - ACCOUNT
    const showResult = function(msg) {

        const p = document.querySelector('.result') 
        p.className = 'result message'
        p.innerText = msg

        setTimeout(() => {
            p.classList.remove('message') 
        }, 10000)
    }

    // Validate email
    const validateEmail = function(email) {
        const re = /^(([^<>()\[\]\\., :\s@"]+(\.[^<>()\[\]\\., :\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
        const result = re.test(String(email.value).toLowerCase()) 

        if (!result) {

            showError(email, "Email không hợp lệ")
            return false 
        }
        showSuccess(email)
        return true
    }

    // Check length
    const checkLength = function(input, min, max) {

        if (input.value.length < min) {

            showError(input, `Tối thiểu ${min} kí tự`)
            return false

        } else if (input.value.length > max) {
            showError(input, `Tối đa ${max} kí tự`) 
            return false 

        } else {
            showSuccess(input) 
            return true 
        }
    }

    // Check password
    const checkPassword = function(pass1, pass2) {

        if (pass1.value !== pass2.value) {

            showError(pass2, `Mật khẩu phải trùng nhau`) 
            return false 
        } else {
            showSuccess(pass2, '')
            return true 
        }
    }

    // Check required
    const checkRequired = function(inputArr) {

        const emptyArr = inputArr.filter((input) => {

            if (input.value.trim() === '') {
                return input 
            }
        }) 

        if (emptyArr.length > 0) {

            emptyArr.forEach((input) => {
                showError(input, 'Vui lòng điền thông tin') 
            })
            return false 
        }

        return true 
    }