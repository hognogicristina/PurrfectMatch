const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const {User, Cat, RefreshToken} = require('../../models')
const validation = require('../validators/authValidator')

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(404).json({error: 'No token provided'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.id)

        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        req.user = user
        next()
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({error: 'Token expired'})
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({error: 'Failed to authenticate token'})
        } else {
            return res.status(500).json({error: 'Internal Server Error'})
        }
    }
}

const authenticateLogin = async (req, res, next) => {
    try {
        const validationErrors = await validation.loginValidation(req) || []
        if (validationErrors.length > 0) {
            return res.status(400).json({errors: validationErrors})
        }

        const {username, password} = req.body
        const user = await User.findOne({where: {username}})

        let isPasswordValid = false
        if (user) {
            isPasswordValid = await bcrypt.compare(password, user.password)
        }

        if (!user || !isPasswordValid) {
            return res.status(401).json({error: 'Invalid username or password'})
        }

        if (user.status === 'active_pending') {
            return res.status(401).json({error: 'Please activate your account by clicking the link sent to your email'})
        } else if (user.status === 'blocked') {
            return res.status(401).json({error: 'Admin has blocked your account until activation'})
        }

        req.user = user
        next()
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const validateRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!refreshToken) {
            return res.status(401).json({error: 'Refresh token is required'})
        }

        const token = await RefreshToken.findOne({where: {token: refreshToken}})
        if (!token) {
            return res.status(401).json({error: 'Invalid refresh token'})
        }

        const user = await User.findByPk(token.userId)
        if (!user) {
            return res.status(401).json({error: 'User not found'})
        }

        req.user = user
        req.refreshToken = refreshToken

        next()
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {
    authenticateToken,
    authenticateLogin,
    validateRefreshToken
}