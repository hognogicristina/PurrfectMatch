const jwt = require('jsonwebtoken')
const {User, RefreshToken} = require('../../models')
const bcrypt = require('bcrypt')
const validation = require('../validators/authValidator')
const emailServ = require('../services/emailService')
const {generateRefreshToken} = require('../helpers/authHelper')

const register = async (req, res) => {
    try {
        if (await validation.registerValidation(req, res)) return

        const {firstName, lastName, username, email, password, birthday} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            firstName, lastName, username, email, password: hashedPassword, birthday,
            status: 'active_pending'
        })

        await emailServ.sendActivationEmail(user)
        res.status(201).json({status: 'User registered successfully'})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const activate = async (req, res) => {
    try {
        if (await validation.validateUser(req, res)) return
        const user = await User.findByPk(req.params.id)
        user.status = 'active'
        user.token = null
        user.signature = null
        user.expires = null

        await emailServ.sendConfirmationEmail(user)
        await user.save()
        res.status(201).json({status: 'Account activated successfully'})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}


const login = async (req, res) => {
    try {
        if (await validation.loginValidation(req, res)) return
        const token = jwt.sign({id: req.user.id, username: req.user.username}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TTL + 's'
        })
        const refreshToken = generateRefreshToken()
        await RefreshToken.create({userId: req.user.id, token: refreshToken})
        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        res.status(200).json({token})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const logout = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.id)
        await RefreshToken.destroy({where: {userId: user.id}})
        res.clearCookie('refreshToken')
        res.status(200).json({status: 'Logged out successfully'})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const refresh = async (req, res) => {
    try {
        const newToken = jwt.sign({id: req.user.id, username: req.user.username}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TTL
        })
        res.status(200).json({newToken})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {register, activate, login, logout, refresh}