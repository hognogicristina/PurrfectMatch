const validator = require('validator')
const {User, Cat, CatUser, Image} = require('../../models')
const bcrypt = require("bcrypt")

const userExistValidator = async (req, res) => {
    const user = await User.findByPk(req.user.id)
    if (!user) {
        return res.status(404).json({error: 'User not found'})
    }
}

const editUserValidation = async (req, res) => {
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

    if (validator.isEmpty(req.body.email || '')) {
        errors.push({field: 'email', error: 'Email is required!'})
    } else if (!validator.isEmail(req.body.email)) {
        errors.push({field: 'email', error: User.rawAttributes.email.validate.isEmail.msg})
    } else {
        const domain = req.body.email.split('@')[1]
        if (domain.includes('meow') && req.user.role !== 'admin') {
            errors.push({field: 'email', error: 'Only admins can use emails from @meow domain'})
        } else {
            const user = await User.findOne({where: {email: req.body.email}})
            if (user && user.id !== req.user.id) {
                errors.push({field: 'email', error: 'Email is already in use!'})
            }
        }
    }

    if (validator.isEmpty(req.body.birthday || '')) {
        errors.push({field: 'birthday', error: 'Birthday is required!'})
    } else if (!validator.isDate(req.body.birthday)) {
        errors.push({field: 'birthday', error: 'Invalid date format! Please use YYYY-MM-DD'})
    }

    if (req.file) {
        const maxSize = 5 * 1024 * 1024
        if (req.file.size > maxSize) {
            errors.push({field: 'file', error: 'File size should not exceed 5MB'})
        }

        const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1)
        const allowedTypes = /jpeg|jpg|png|gif/i
        if (!allowedTypes.test(extension)) {
            errors.push({field: 'file', error: 'Only image files are allowed!'})
        }
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const editAddressValidation = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.country || '')) {
        errors.push({field: 'country', error: 'Country is required!'})
    }

    if (validator.isEmpty(req.body.city || '')) {
        errors.push({field: 'city', error: 'City is required!'})
    }

    if (validator.isEmpty(req.body.street || '')) {
        errors.push({field: 'street', error: 'Street is required!'})
    }

    if (validator.isEmpty(req.body.number || '')) {
        errors.push({field: 'number', error: 'Number is required!'})
    }

    if (validator.isEmpty(req.body.postalCode || '')) {
        errors.push({field: 'postalCode', error: 'Postal code is required!'})
    } else if (!validator.isPostalCode(req.body.postalCode, 'any')) {
        errors.push({field: 'postalCode', error: 'Invalid postal code!'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const editUsernameValidation = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.username || '')) {
        errors.push({field: 'username', error: 'Username is required!'})
    } else if (!validator.isLength(req.body.username, {min: 3})) {
        errors.push({field: 'username', error: 'Username must be at least 3 characters long!'})
    } else {
        const user = await User.findOne({where: {username: req.body.username}})
        if (user && user.id !== req.user.id) {
            errors.push({field: 'username', error: 'Username is already in use!'})
        }
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const editPasswordValidation = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.currentPassword || '')) {
        errors.push({field: 'currentPassword', error: 'Current password is required!'})
    } else {
        const user = await User.findByPk(req.user.id)
        if (!await bcrypt.compare(req.body.currentPassword, user.password)) {
            errors.push({field: 'currentPassword', error: 'Invalid password!'})
        }
    }

    if (validator.isEmpty(req.body.newPassword || '')) {
        errors.push({field: 'newPassword', error: 'New password is required!'})
    } else if (!validator.isStrongPassword(req.body.newPassword)) {
        errors.push({
            field: 'newPassword',
            error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character!'
        })
    } else if (req.body.newPassword !== req.body.confirmPassword) {
        errors.push({field: 'confirmPassword', error: 'Passwords do not match!'})
    } else if (req.body.newPassword === req.body.currentPassword) {
        errors.push({field: 'newPassword', error: 'New password must be different from the current password!'})
    }

    if (validator.isEmpty(req.body.confirmPassword || '')) {
        errors.push({field: 'confirmPassword', error: 'Confirm password is required!'})
    } else if (req.body.newPassword !== req.body.confirmPassword) {
        errors.push({field: 'confirmPassword', error: 'Passwords do not match!'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const deleteUserValidation = async (req, res) => {
    const errors = []

    const user = await User.findByPk(req.user.id)
    if (!user) {
        return res.status(404).json({error: 'User not found'})
    }

    if (validator.isEmpty(req.body.password || '')) {
        errors.push({field: 'password', error: 'Password is required!'})
    } else {
        const user = await User.findByPk(req.user.id)
        if (!await bcrypt.compare(req.body.password, user.password)) {
            errors.push({field: 'password', error: 'Invalid password!'})
        }
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

module.exports = {
    userExistValidator,
    editUserValidation,
    editAddressValidation,
    editUsernameValidation,
    editPasswordValidation,
    deleteUserValidation
}