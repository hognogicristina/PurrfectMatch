const fs = require("fs")
const path = require('path')
const {Op} = require('sequelize')
const {Address, Image, User, Cat, RefreshToken, CatUser, Message} = require('../../models')
const UserDTO = require('../dto/userDTO')
const validator = require('../validators/userValidator')
const emailServ = require('../services/emailService')

const getOneUser = async (req, res) => {
    try {
        if (await validator.userExistValidator(req, res)) return
        const userDetails = new UserDTO(req.user)
        const addressId = req.user.addressId
        userDetails.address = await Address.findByPk(addressId)
        return res.json({success: userDetails})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editUser = async (req, res) => {
    try {
        if (await validator.editUserValidation(req, res)) return

        let emailChanged = false
        const fieldsToUpdate = ['firstName', 'lastName', 'email', 'birthday', 'description', 'hobbies', 'experienceLevel']
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined && field === 'email' && req.body[field] !== req.user.email) {
                req.user[field] = req.body[field]
                emailChanged = true
            } else if (req.body[field] !== undefined) {
                req.user[field] = req.body[field]
            }
        })

        if (emailChanged) {
            req.user.status = 'active_pending'
            await emailServ.sendResetEmail(req.user)
        }

        await req.user.save()

        if (req.file) {
            let image = await Image.findByPk(req.user.imageId)

            if (image) {
                const oldImagePath = path.join('public', 'files', image.filename)
                fs.unlinkSync(oldImagePath)
            } else {
                image = new Image()
            }

            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            const extension = path.extname(req.file.originalname)
            const filename = `${uniqueSuffix}${extension}`
            const address = `${process.env.SERVER_BASE_URL}`
            const imagePath = path.join('public', 'files', filename)
            const imageUrl = `${address}/files/${filename}`

            image.filename = filename
            image.filetype = extension.replace('.', '')
            image.filesize = req.file.size
            image.url = imageUrl
            await image.save()

            req.user.imageId = image.id
            await req.user.save()

            fs.writeFileSync(imagePath, req.file.buffer)
        }

        return res.json({success: 'User updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editAddressUser = async (req, res) => {
    try {
        if (await validator.editAddressValidation(req, res)) return

        const user = await User.findByPk(req.user.id)
        const addressFields = ['country', 'county', 'city', 'street', 'number', 'floor', 'apartment', 'postalCode']
        const address = await Address.findByPk(user.addressId) || new Address()

        addressFields.forEach(field => {
            address[field] = req.body[field] === '' || req.body[field] === undefined ? null : req.body[field]
        })

        await address.save()
        user.addressId = address.id
        await user.save()

        return res.json({success: 'Address updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editUsername = async (req, res) => {
    try {
        if (await validator.editUsernameValidation(req, res)) return
        const user = await User.findByPk(req.user.id)
        user.username = req.body.newUsername
        await user.save()
        return res.json({success: 'Username updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editPassword = async (req, res) => {
    try {
        if (await validator.editPasswordValidation(req, res)) return
        const user = await User.findByPk(req.user.id)
        user.password = req.body.newPassword
        await user.save()
        return res.json({success: 'Password updated successfully'})

    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const deleteUser = async (req, res) => {
    const transaction = await Cat.sequelize.transaction()

    try {
        const userId = req.user.id

        if (await validator.userExistValidator(req, res)) {
            await transaction.rollback()
            return
        }

        const user = await User.findByPk(userId, {transaction})
        const messages = await Message.findAll({where: {clientId: userId}, transaction})
        const hasPendingMessages = messages.some(message => message.status === 'pending')
        if (hasPendingMessages) {
            await transaction.rollback()
            return res.status(400).json({ error: 'Cat cannot be deleted because there are pending messages.' })
        }

        await RefreshToken.destroy({where: {userId}, transaction})
        await Message.destroy({where: {clientId: userId}, transaction})
        await CatUser.update({userId: null}, {where: {userId, ownerId: {[Op.ne]: userId}}, transaction})
        await CatUser.update({ownerId: null}, {
            where: {ownerId: userId, userId: {[Op.ne]: userId}},
            transaction
        })

        const cats = await Cat.findAll({
            where: {
                [Op.or]: [{userId}, {ownerId: userId}]
            },
            transaction
        })

        for (let cat of cats) {
            const catUsers = await CatUser.findAll({where: {catId: cat.id}, transaction})
            for (let catUser of catUsers) {
                if (cat.userId === userId && cat.ownerId === userId) {
                    await catUser.destroy({transaction})
                    console.log(catUser)
                    await cat.destroy({transaction})
                    let catImage = await Image.findByPk(cat.imageId, {transaction})
                    fs.unlinkSync(path.join('public', 'files', catImage.filename))
                    await catImage.destroy({transaction})
                } else {
                    if (cat.userId === userId) {
                        cat.userId = null
                        catUser.userId = null
                    }
                    if (cat.ownerId === userId) {
                        cat.ownerId = null
                        catUser.ownerId = null
                    }
                    await catUser.save({transaction})
                    await cat.save({transaction})
                }
            }
        }

        await user.destroy({transaction})
        let image = await Image.findByPk(user.imageId, {transaction})
        if (image) {
            fs.unlinkSync(path.join('public', 'files', image.filename))
            await image.destroy({transaction})
        }
        let address = await Address.findByPk(user.addressId, {transaction})
        if (address) {
            await address.destroy({transaction})
        }
        await transaction.commit()
        return res.status(200).json({success: 'User deleted successfully'})
    } catch (err) {
        await transaction.rollback()
        console.error(err)
        return res.status(500).json({error: 'Internal server error'})
    }
}


module.exports = {
    getOneUser,
    editUser,
    editAddressUser,
    editUsername,
    editPassword,
    deleteUser
}