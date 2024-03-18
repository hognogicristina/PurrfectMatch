import crypto from "crypto"

const generateTokenAndSignature = async (user) => {
    const token = crypto.randomBytes(16).toString('hex')
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET).update(token).digest('hex')

    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    user.token = token
    user.signature = signature
    user.expires = expires
    await user.save()

    return `${process.env.SERVER_BASE_URL}/activate/${user.id}?token=${token}&signature=${signature}&expires=${expires.getTime()}`
}

module.exports = {generateTokenAndSignature}