 const jwt = require('jsonwebtoken')
 const User = require('../models/user')

 const auth = async(req, res, next) => {

     try {
         const token = req.cookies.jwt;

         const decoded = jwt.decode(token, process.env.JWT_SECRET);
         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

         if (!user) {
             throw new Error()
         }

         req.user = user
         req.token = token

         next();

     } catch (e) {
         res.redirect('/');
     }
 }

 module.exports = auth