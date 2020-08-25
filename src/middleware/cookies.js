const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkLogin = async(req, res, next) => {

try{
    const token = req.cookies.jwt

    if (token !== undefined) {
        throw new Error('Logged')
    }

    next() 
}catch(e){
    res.redirect('/list')
}
}

const checkTokenReset = async(req, res, next) => {

    try {
        const tokenReset = req.cookies.tokenReset

        if (tokenReset === undefined) {
            throw new Error('Check Token Reset Error: TokenReset undefined')
        }
        
        next() 

    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
}

module.exports = {
    checkLogin,
    checkTokenReset
}