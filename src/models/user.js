const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {

            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        validate(value) {

            if (validator.contains(value.toLowerCase(), 'password')) {
                throw new Error('Password must not contain string "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    passwordResetToken: String,
    passwordResetExpires: Date
},
 {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
 
    return token
}

userSchema.methods.createdPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    console.log({resetToken},this.passwordResetToken)

    return resetToken
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login') 
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unabale to login') 
    }

    return user
}

// Check email and update
userSchema.methods.updateEmail = async function(newEmail) {

    const user = this 

    const info = await User.findOne({ email: newEmail }) 

    if (info) {
        throw new Error('Email already exists') 
    }

    await User.findByIdAndUpdate(user._id, {
        email: newEmail
    })

    const newUser = await User.findById(user._id) 

    return newUser 
}

// Hash the plain text before save in db
userSchema.pre('save', async function(next) {
    const user = this 
    if (user.isModified('password')) {

        user.password = await bcrypt.hash(user.password, 8) 
    }

    next() 
})

// Delete tasks when delete user
userSchema.pre('remove', async function(next) {

    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User