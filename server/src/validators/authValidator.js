const validator = require('validator')
const {User, PasswordHistory} = require('../../models')
const bcrypt = require("bcrypt")

const validateUser = async (req, res) => {
    const errors = []
    const user = await User.findOne({where: {id: req.params.id}})
    if (!user) {
        errors.push({field: 'id', error: 'User not found'})
    }

    const {token, signature} = req.query
    if (new Date() > new Date(user.expires)) {
        errors.push({field: 'token', error: 'Token has expired'})
    }

    if (user.token !== token) {
        errors.push({field: 'token', error: 'Invalid token'})
    }

    if (user.signature !== signature) {
        errors.push({field: 'signature', error: 'Invalid signature'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const registerValidation = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.firstName || '')) {
        errors.push({field: 'firstName', error: 'First name is required'})
    } else if (!validator.isLength(req.body.firstName, {min: 3})) {
        errors.push({field: 'firstName', error: 'First name must be at least 3 characters long'})
    }

    if (validator.isEmpty(req.body.lastName || '')) {
        errors.push({field: 'lastName', error: 'Last name is required'})
    } else if (!validator.isLength(req.body.lastName, {min: 3})) {
        errors.push({field: 'lastName', error: 'Last name must be at least 3 characters long'})
    }

    if (validator.isEmpty(req.body.username || '')) {
        errors.push({field: 'username', error: 'Username is required'})
    } else if (!validator.isLength(req.body.username, {min: 3})) {
        errors.push({field: 'username', error: 'Username must be at least 3 characters long'})
    } else {
        const user = await User.findOne({where: {username: req.body.username}})
        if (user) {
            errors.push({field: 'username', error: 'Username is already in use'})
        }
    }

    if (validator.isEmpty(req.body.email || '')) {
        errors.push({field: 'email', error: 'Email is required'})
    } else if (!validator.isEmail(req.body.email)) {
        errors.push({field: 'email', error: User.rawAttributes.email.validate.isEmail.msg})
    } else {
        const user = await User.findOne({where: {email: req.body.email}})
        if (user) {
            errors.push({field: 'email', error: 'Email is already in use by another user'})
        }
    }

    if (validator.isEmpty(req.body.password || '')) {
        errors.push({field: 'password', error: 'Password is required'})
    } else if (!validator.isStrongPassword(req.body.password)) {
        errors.push({
            field: 'password',
            error: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
        })
    }

    if (validator.isEmpty(req.body.birthday || '')) {
        errors.push({field: 'birthday', error: 'Birthday is required'})
    } else if (!validator.isDate(req.body.birthday)) {
        errors.push({field: 'birthday', error: 'Invalid date format Please use YYYY-MM-DD'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const loginValidation = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.username || '')) {
        errors.push({field: 'username', error: 'Username is required'})
    }

    if (validator.isEmpty(req.body.password || '')) {
        errors.push({field: 'password', error: 'Password is required'})
    }

    const user = await User.findOne({where: {username: req.body.username}})
    if (user.status === 'active_pending') {
        return res.status(401).json({error: 'Please activate your account by clicking the link sent to your email'})
    } else if (user.status === 'blocked') {
        return res.status(401).json({error: 'Admin has blocked your account until activation'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const resetValidationEmail = async (req, res) => {
    const errors = []
    const user = await User.findOne({where: {email: req.body.email}})

    if (validator.isEmpty(req.body.email || '')) {
        return res.status(400).json({error: 'Email is required in order to reset your password'})
    } else if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({error: User.rawAttributes.email.validate.isEmail.msg})
    }

    if (!user) {
        return res.status(400).json({status: 'If the email exists, a reset link will be sent'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const resetValidationPassword = async (req, res) => {
    if (validator.isEmpty(req.body.password || '')) {
        return res.status(400).json({error: 'Password is required'})
    } else if (!validator.isStrongPassword(req.body.password)) {
        return res.status(400).json({error: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'})
    } else if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({error: 'Passwords do not match'})
    }

    const password = req.body.password
    const passwordHistories = await PasswordHistory.findAll({
        where: {userId: req.params.id},
        order: [['createdAt', 'DESC']],
        limit: 3
    })
    const isPasswordUsed = passwordHistories.some(history => bcrypt.compareSync(password, history.password))
    if (isPasswordUsed) {
        return res.status(400).json({error: 'You cannot reuse one of your last three passwords'})
    }

    return null
}

module.exports = {
    validateUser,
    registerValidation,
    loginValidation,
    resetValidationEmail,
    resetValidationPassword
}