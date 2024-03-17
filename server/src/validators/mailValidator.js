const {Mail, Cat, Address, UserMail} = require('../../models')
const validator = require("validator")

const adoptValidator = async (req, res) => {
    const errors = []
    const userId = req.user.id

    if (req.params.id) {
        const cat = await Cat.findByPk(req.params.id)
        if (!cat) {
            errors.push({field: 'cat', error: 'Cat not found!'})
            return res.status(400).json({errors})
        }

        if (cat.userId === userId) {
            errors.push({field: 'cat', error: 'You are not allowed to send adoption request for your own cat!'})
        }

        if (cat.ownerId !== null) {
            errors.push({field: 'cat', error: 'Cat already adopted!'})
        }
    }

    const pendingMails = await Mail.findAll({
        where: {catId: req.params.id, status: 'pending'},
        attributes: ['id'],
    });

    for (const mail of pendingMails) {
        const existingRequest = await UserMail.findOne({
            where: {mailId: mail.id, userId: userId, role: 'sender'}
        });

        if (existingRequest) {
            errors.push({field: 'cat', error: 'Adoption request already sent!'});
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

    if (req.params.id) {
        const mail = await Mail.findByPk(id)
        if (!mail) {
            return res.status(404).json({error: 'Mail not found'})
        }

        const cat = await Cat.findByPk(mail.catId)
        if (cat.userId !== userId) {
            return res.status(403).json({error: 'You are not allowed to handle this request'})
        }

        if (mail.status !== 'pending') {
            errors.push({field: 'status', error: 'Status already updated!'})
        }
    }

    const userAddress = await Address.findOne({where: {id: req.user.addressId}})
    if (!userAddress) {
        return res.status(404).json({error: 'Address not found for the sender user'})
    }

    if (status !== 'accepted' && status !== 'declined') {
        errors.push({field: 'status', error: 'Invalid status!'})
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

    if (mail.status === 'pending') {
        errors.push({field: 'status', error: 'Cannot delete pending mails!'})
    }

    const userMail = await UserMail.findOne({where: {userId, mailId}})
    if (!userMail) {
        return res.status(403).json({error: 'You are not allowed to delete this mail'})
    }

    if (!userMail.isVisible) {
        return res.status(400).json({error: 'Mail already deleted'})
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

module.exports = {
    adoptValidator,
    handleAdoptionRequestValidator,
    deleteMailValidator
}