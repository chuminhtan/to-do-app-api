const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkAuth = async(req, res, next) => {

    try {
        const token = req.cookies.jwt

        if (token !== undefined) {
            throw new Error()
        }

        next();

    } catch (e) {
        res.redirect('/list');
    }
}

module.exports = checkAuth