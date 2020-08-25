const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const {checkLogin} = require('../middleware/cookies')

router.get('/', checkLogin, async(req, res) => {

    res.render('home', {
        title: 'To-do App',
        part: 'Welcome',
        user: {
            name: 'Trang Chủ',
        }
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Đăng Kí',
        part: 'Đăng Kí',
        user: {
            name: 'Trang Chủ',
        }
    });
});

router.get('/login', checkLogin, async(req, res) => {

    res.render('login', {
        title: 'Đăng Nhập',
        part: 'Đăng Nhập',
        user: {
            name: 'Trang Chủ',
        }
    });
})

router.get('/list', auth, (req, res) => {
    res.render('list', {
        title: 'Danh Sách',
        part: 'Danh Sách',
        user: {
            name: `${req.user.name} - Đăng Xuất`,
        }
    });
})

router.get('/account', auth, (req, res) => {
    res.render('account', {
        title: 'Tài Khoản',
        part: 'Tài Khoản',
        user: {
            name: `${req.user.name} - Đăng Xuất`,
        }
    });
})

router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword', {
        title: 'Quên Mật Khẩu',
        part: 'Gửi Yêu Cầu Reset Mật Khẩu',
        user: {
            name: `Trang Chủ`,
        }
    })
})


router.get('*', (req, res) => {
    res.render('404', {
        title: '404-Page not found',
        part: '404 - Trang không tồn tại',
        user: {
            name: `Xin Chào`,
        }
    })
})
module.exports = router