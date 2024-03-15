const validator = require('validator')
const {User} = require('../../models')

const validateUser = async (req, res) => {
    const errors = []
    const user = await User.findOne({where: {id: req.params.id}})
    if (!user) {
        errors.push({field: 'id', error: 'User not found!'})
    }

    const { token, signature } = req.query
    if (new Date() > new Date(user.expires)) {
        errors.push({field: 'token', error: 'Token has expired!'})
    }

    if (user.token !== token) {
        errors.push({field: 'token', error: 'Invalid token!'})
    }

    if (user.signature !== signature) {
        errors.push({field: 'signature', error: 'Invalid signature!'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const registerValidation = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.firstName || '')) {
        errors.push({field: 'firstName', error: 'First name is required!'})
    } else if (!validator.isLength(req.body.firstName, {min: 3})) {
        errors.push({field: 'firstName', error: 'First name must be at least 3 characters long!'})
    }

    if (validator.isEmpty(req.body.lastName || '')) {
        errors.push({field: 'lastName', error: 'Last name is required!'})
    } else if (!validator.isLength(req.body.lastName, {min: 3})) {
        errors.push({field: 'lastName', error: 'Last name must be at least 3 characters long!'})
    }

    if (validator.isEmpty(req.body.username || '')) {
        errors.push({field: 'username', error: 'Username is required!'})
    } else if (!validator.isLength(req.body.username, {min: 3})) {
        errors.push({field: 'username', error: 'Username must be at least 3 characters long!'})
    } else {
        const user = await User.findOne({where: {username: req.body.username}})
        if (user) {
            errors.push({field: 'username', error: 'Username is already in use!'})
        }
    }

    if (validator.isEmpty(req.body.email || '')) {
        errors.push({field: 'email', error: 'Email is required!'})
    } else if (!validator.isEmail(req.body.email)) {
        errors.push({field: 'email', error: User.rawAttributes.email.validate.isEmail.msg})
    } else {
        const user = await User.findOne({where: {email: req.body.email}})
        if (user) {
            errors.push({field: 'email', error: 'Email is already in use!'})
        }
    }

    if (validator.isEmpty(req.body.password || '')) {
        errors.push({field: 'password', error: 'Password is required!'})
    } else if (!validator.isStrongPassword(req.body.password)) {
        errors.push({
            field: 'password',
            error: 'Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character!'
        })
    }

    if (validator.isEmpty(req.body.birthday || '')) {
        errors.push({field: 'birthday', error: 'Birthday is required!'})
    } else if (!validator.isDate(req.body.birthday)) {
        errors.push({field: 'birthday', error: 'Invalid date format! Please use YYYY-MM-DD'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const loginValidation = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.username || '')) {
        errors.push({field: 'username', error: 'Username is required!'})
    }

    if (validator.isEmpty(req.body.password || '')) {
        errors.push({field: 'password', error: 'Password is required!'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

module.exports = {
    validateUser,
    registerValidation,
    loginValidation
}