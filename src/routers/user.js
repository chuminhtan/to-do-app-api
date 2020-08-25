const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const { checkTokenReset } = require('../middleware/cookies')
const crypto = require('crypto')
const { sendWelcomeEmail, sendResetPasswordEmail } = require('../utils/email')


// Create user - POST 
router.post('/users', async (req, res) => {

    try {
        const user = new User(req.body)
        console.log('new User', user)
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })

    } catch (e) {

        res.status(400).send(e)
    }
})

// Login - POST
router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
        res.send(user)

    } catch (e) {
        res.status(404).send(e)
    }
})

// Logout one - POST
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.clearCookie('jwt')
        res.render('home', {
            title: 'To-do App',
            part: 'Welcome',
            user: {
                name: 'Trang Chủ',
                setting: '/'
            }
        })

    } catch (e) {
        res.status(500).send()
    }
})

// Logout all - POST
// router.post('/users/logoutAll', auth, async (req, res) => {
//     try {
//         req.user.tokens = []
//         await req.user.save()

//         res.send()

//     } catch (e) {
//         res.status(500).send()
//     }
// })

// Read user with find - GET
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Update user
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})

// Update info : NAME AND EMAIL
router.patch('/users/info', auth, async (req, res) => {
    let newUser
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    newUser = await User.findByIdAndUpdate(req.user._id, { name: req.body.name })

    if (req.body.email === '') {

        res.send(newUser)
        return
    }

    try {

        newUser = await req.user.updateEmail(req.body.email)
        res.send(newUser)

    } catch (e) {
        res.status(400).send()
    }
})

// Update password
router.patch('/users/password', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['passwordOld', 'passwordNew']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        console.log(req.body)

        let user = await User.findByCredentials(req.user.email, req.body.passwordOld)

        console.log('user finded: ' + user)
        user.password = req.body.passwordNew
        user = await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove()
        res.clearCookie('jwt')

        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

// Forgot password
router.post('/users/forgotPassword', async (req, res) => {

    // Get user based on POSTed email

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        console.log('Email not valid');
        return res.status(400).send()
    }

    // Generate the random reset token
    const resetToken = user.createdPasswordResetToken()

    console.log('reset: ' + resetToken);
    await user.save()

    // Send it to user's email

    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`

    try {

        sendResetPasswordEmail(user.email, user.name, resetURL)

        res.status(200).json({
            status: 'success',
        })

    } catch (e) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()
        return res.status(500).send(e)
    }

})

// Reset Password
router.get('/users/resetPassword/:tokenReset', async (req, res) => {

    // Get user based on the token
    const tokenReset = req.params.tokenReset

    const hashedToken = crypto.createHash('sha256').update(tokenReset).digest('hex')

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    // If token has not expired, and there is user, set the new password
    if (!user) {
        return res.redirect('/expried')
    }

    res.cookie('tokenReset', tokenReset, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
    res.render('resetPassword', {
        title: 'Reset Mật Khẩu',
        part: 'Reset Mật Khẩu',
        user: {
            name: 'Trang Chủ',
        }
    })
})

// Reset password
router.patch('/users/changePasswordReset', checkTokenReset, async (req, res) => {

    const tokenReset = req.cookies.tokenReset
    const hashedToken = crypto.createHash('sha256').update(tokenReset).digest('hex')
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
    // If token has not expired, and there is user, set the new password

    if (!user) {
        return rs.status(400).send()
    }

    try {
        user.password = req.body.password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        res.clearCookie('tokenReset')
        res.status(200).send()

    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})

module.exports = router