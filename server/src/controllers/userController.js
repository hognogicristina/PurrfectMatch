const fs = require("fs")
const path = require('path')
const {Op} = require('sequelize')
const {Address, Image, User, Cat, RefreshToken, CatUser, Mail, UserMail} = require('../../models')
const UserDTO = require('../dto/userDTO')
const validator = require('../validators/userValidator')
const emailServ = require('../services/emailService')
const emailService = require("../services/emailService");

const getOneUser = async (req, res) => {
    try {
        if (await validator.userExistValidator(req, res)) return
        const user = req
        const userDetails = new UserDTO(user)
        const addressId = user.addressId
        userDetails.address = await Address.findByPk(addressId)
        return res.json({data: userDetails})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editUser = async (req, res) => {
    try {
        if (await validator.editUserValidation(req, res)) return

        const user = req.user
        let emailChanged = false
        const fieldsToUpdate = ['firstName', 'lastName', 'email', 'birthday', 'description', 'hobbies', 'experienceLevel']
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined && field === 'email' && req.body[field] !== user.email) {
                user[field] = req.body[field]
                emailChanged = true
            } else if (req.body[field] !== undefined) {
                user[field] = req.body[field]
            }
        })

        if (emailChanged) {
            user.status = 'active_pending'
            await emailServ.sendResetEmail(user)
        }

        await user.save()

        if (req.file) {
            let image = await Image.findByPk(user.imageId)

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

            user.imageId = image.id
            await user.save()

            fs.writeFileSync(imagePath, req.file.buffer)
        }

        return res.json({status: 'User updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editAddressUser = async (req, res) => {
    try {
        if (await validator.editAddressValidation(req, res)) return

        const user = req.user
        const addressFields = ['country', 'county', 'city', 'street', 'number', 'floor', 'apartment', 'postalCode']
        const address = await Address.findByPk(user.addressId) || new Address()

        addressFields.forEach(field => {
            address[field] = req.body[field] === '' || req.body[field] === undefined ? null : req.body[field]
        })

        await address.save()
        user.addressId = address.id
        await user.save()

        return res.json({status: 'Address updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editUsername = async (req, res) => {
    try {
        if (await validator.editUsernameValidation(req, res)) return
        const user = req.user
        user.username = req.body.newUsername
        await user.save()
        return res.json({status: 'Username updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editPassword = async (req, res) => {
    try {
        if (await validator.editPasswordValidation(req, res)) return
        const user = req.user
        user.password = req.body.newPassword
        await user.save()
        return res.json({status: 'Password updated successfully'})

    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const deleteUser = async (req, res) => {
    const transaction = await User.sequelize.transaction()

    try {
        if (await validator.deleteUserValidation(req, res)) {
            await transaction.rollback()
            return
        }

        const user = req.user
        const userMails = await UserMail.findAll({where: {userId: user.id}})
        for (let userMail of userMails) {
            if (userMail.role === 'receiver') {
                const mail = await Mail.findOne({where: {id: userMail.mailId}})
                const senderUserMails = await UserMail.findAll({where: {mailId: mail.id, role: 'sender'}})
                for (let senderUserMail of senderUserMails) {
                    const sender = await User.findOne({where: {id: senderUserMail.userId}})
                    await emailService.sendDeclineAdoption(sender, user, mail)
                }
            }

            const mail = await Mail.findOne({where: {id: userMail.mailId}})
            const otherUserMails = await UserMail.findAll({where: {mailId: mail.id}})
            for (let otherUserMail of otherUserMails) {
                await otherUserMail.destroy()
            }
            await mail.destroy()
        }

        const cats = await Cat.findAll({where: {userId: user.id}})
        for (let cat of cats) {
            const catUsers = await CatUser.findAll({where: {catId: cat.id}})
            for (let catUser of catUsers) {
                await catUser.destroy()
            }
            const image = await Image.findOne({where: {id: cat.imageId}})
            const imagePath = path.join('public', 'files', image.filename)
            await fs.unlinkSync(imagePath)
            await cat.destroy()
            await image.destroy()
        }

        await RefreshToken.destroy({where: {userId: user.id}})
        const image = await Image.findOne({where: {id: user.imageId}})
        await user.destroy()
        if (image) {
            const imagePath = path.join('public', 'files', image.filename)
            await fs.unlinkSync(imagePath)
            await image.destroy()
        }

        const address = await Address.findByPk(user.addressId)
        if (address) {
            await address.destroy()
        }

        await transaction.commit()
        return res.status(200).json({status: 'User deleted successfully'})
    } catch (err) {
        await transaction.rollback()
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