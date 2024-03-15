const {Mail, Cat, Address, UserMail} = require('../../models')
const validator = require("validator")

const adoptValidator = async (req, res) => {
    const errors = []
    const userId = req.user.id
    const {id} = req.params
    const cat = await Cat.findByPk(id)

    if (!cat) {
        errors.push({field: 'cat', error: 'Cat not found!'})
    }

    if (cat.ownerId !== null) {
        errors.push({field: 'cat', error: 'Cat already adopted!'})
    }

    if (cat.userId === userId) {
        errors.push({field: 'cat', error: 'You are not allowed to adopt your own cat!'})
    }

    const pendingMails = await Mail.findAll({
        where: { catId: id, status: 'pending' },
        attributes: ['id'],
    });

    for (let mail of pendingMails) {
        const existingRequest = await UserMail.findOne({
            where: { mailId: mail.id, userId: userId, role: 'sender' }
        });

        if (existingRequest) {
            errors.push({ field: 'cat', error: 'Adoption request already sent!' });
        }
    }

    if (validator.isEmpty(req.body.message)) {
        errors.push({field: 'message', error: 'Message is required!'})
    } else if (!validator.isLength(req.body.message, {min: 10, max: 100})) {
        errors.push({field: 'message', error: 'Message must be between 10 and 100 characters!'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const handleAdoptionRequestValidator = async (req, res) => {
    const errors = []
    const {id} = req.params
    const {status} = req.body
    const userId = req.user.id

    const userAddress = await Address.findOne({where: {id: req.user.addressId}})
    if (!userAddress) {
        return res.status(404).json({error: 'Address not found for the sender user'})
    }

    const mail = await Mail.findByPk(id)
    if (!mail) {
        return res.status(404).json({error: 'Mail not found'})
    }

    const cat = await Cat.findByPk(mail.catId)
    if (!cat) {
        return res.status(404).json({error: 'Cat not found'})
    } else if (cat.userId !== userId) {
        return res.status(403).json({error: 'You are not allowed to handle this request'})
    }

    if (status !== 'accepted' && status !== 'declined') {
        errors.push({field: 'status', error: 'Invalid status!'})
    }

    if (mail.status !== 'pending') {
        errors.push({field: 'status', error: 'Status already updated!'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

const deleteMailValidator = async (req, res) => {
    const errors = []
    const userId = req.user.id
    const mailId = req.params.id

    const mail = await Mail.findByPk(mailId)
    if (!mail) {
        return res.status(404).json({error: 'Mail not found'})
    }
    const cat = await Cat.findByPk(mail.catId)
    if (mail.senderId !== userId && (!cat || cat.userId !== userId)) {
        return res.status(403).json({error: 'User is not authorized to delete this mail'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

module.exports = {
    adoptValidator,
    handleAdoptionRequestValidator,
    deleteMailValidator
}