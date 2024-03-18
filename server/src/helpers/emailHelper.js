const crypto = require('crypto')
const pug = require("pug");
const {User} = require("../../models");

const generateTokenAndSignature = async (user) => {
    const token = crypto.randomBytes(16).toString('hex')
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET).update(token).digest('hex')

    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    user.token = token
    user.signature = signature
    user.expires = expires
    await user.save()
    const sender = await User.findOne({where: {role: 'admin'}})
    const activationLink = `${process.env.SERVER_BASE_URL}/activate/${user.id}?token=${token}&signature=${signature}&expires=${expires.getTime()}`

    return {activationLink, sender}
}

const sendAdoptionContent = async (sender, receiver, cat, address) => {
    const image = await Image.findOne({where: {id: cat.imageId}})
    const imageUrl = `${process.env.SERVER_BASE_URL}/files/${image.filename}`

    const compiledFunction = pug.compileFile(path.join(__dirname, '..', 'templates', 'adoptionEmail.pug'))

    return compiledFunction({
        senderName: {firstName: sender.firstName, lastName: sender.lastName},
        imageUrl: imageUrl,
        cat: {
            name: cat.name,
            age: cat.age,
            breed: cat.breed,
            gender: cat.gender,
            healthProblem: cat.healthProblem,
            description: cat.description
        },
        address: {
            county: address.county,
            city: address.city,
            street: address.street,
            number: address.number,
            floor: address.floor,
            apartment: address.apartment,
            postalCode: address.postalCode
        },
        receiverName: {firstName: receiver.firstName, lastName: receiver.lastName},
    })
}

module.exports = {generateTokenAndSignature, sendAdoptionContent}