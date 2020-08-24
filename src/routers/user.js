const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

// Create user - POST 
router.post('/users', async(req, res) => {

    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })

    } catch (e) {

        res.status(400).send()
    }
})

// Login - POST

router.post('/users/login', async(req, res) => {

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

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save();

        res.clearCookie('jwt');

        res.render('home', {
            title: 'To-do App',
            part: 'Welcome',
            user: {
                name: 'Trang Chủ',
                setting: '/'
            }
        });

    } catch (e) {
        res.status(500).send()
    }
})

// Logout all - POST

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()

    } catch (e) {
        res.status(500).send()
    }
})

// Read user with find - GET

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})

// Read user by ID - GET

// router.get('/users/:id', async(req, res) => {

//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         res.send(user)

//     } catch (e) {
//         res.status(404).send(e)
//     }
// })

// Update user

router.patch('/users/me', auth, async(req, res) => {

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
        res.status(400).send(e);
    }
})


// Update info : NAME AND EMAIL
router.patch('/users/info', auth, async(req, res) => {

    let newUser;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    newUser = await User.findByIdAndUpdate(req.user._id, { name: req.body.name });

    if (req.body.email === '') {

        res.send(newUser);
        return;
    }

    try {

        newUser = await req.user.updateEmail(req.body.email)
        res.send(newUser);

    } catch (e) {
        res.status(400).send();
    }
})

// Update password
router.patch('/users/password', auth, async(req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['passwordOld', 'passwordNew'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        console.log(req.body);

        let user = await User.findByCredentials(req.user.email, req.body.passwordOld);

        console.log('user finded: ' + user);
        user.password = req.body.passwordNew;
        user = await user.save();

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete user

router.delete('/users/me', auth, async(req, res) => {
    try {

        await req.user.remove()
        res.send(req.user)

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router