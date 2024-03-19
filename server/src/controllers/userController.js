const bcrypt = require("bcrypt")
const {Address, Image, User, RefreshToken, PasswordHistory} = require('../../models')
const emailService = require('../services/emailService')
const validator = require('../validators/userValidator')
const catHelper = require('../helpers/catHelper')
const mailHelper = require('../helpers/mailHelper')
const fileHelper = require("../helpers/fileHelper")
const UserDTO = require('../dto/userDTO')

const getOneUser = async (req, res) => {
    try {
        if (await validator.userExistValidator(req, res)) return
        const userDetails = new UserDTO(req.user)
        const addressId = req.user.addressId
        userDetails.address = await Address.findByPk(addressId)
        return res.json({data: userDetails})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editUser = async (req, res) => {
    try {
        if (await validator.editUserValidation(req, res)) return
        const fieldsToUpdate = ['firstName', 'lastName', 'email', 'birthday', 'description', 'hobbies', 'experienceLevel']
        await mailHelper.updateEmail(req.user, fieldsToUpdate, req.body)

        req.user.imageId = await fileHelper.updateImage(req.user, req.file)
        await req.user.save()
        return res.json({status: 'User updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editAddressUser = async (req, res) => {
    try {
        if (await validator.editAddressValidation(req, res)) return

        const addressFields = ['country', 'county', 'city', 'street', 'number', 'floor', 'apartment', 'postalCode']
        const address = await Address.findByPk(req.user.addressId) || new Address()

        addressFields.forEach(field => {
            address[field] = req.body[field] === '' || req.body[field] === undefined ? null : req.body[field]
        })

        await address.save()
        req.user.addressId = address.id
        await req.user.save()
        return res.json({status: 'Address updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editUsername = async (req, res) => {
    try {
        if (await validator.editUsernameValidation(req, res)) return
        req.user.username = req.body.newUsername
        await req.user.save()
        return res.json({status: 'Username updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editPassword = async (req, res) => {
    try {
        if (await validator.editPasswordValidation(req, res)) return
        req.user.password = await bcrypt.hash(req.body.newPassword, 10)
        await req.user.save()
        await PasswordHistory.create({userId: req.user.id, password: req.user.password})
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

        await emailService.sendDeleteAccount(req.user)
        await mailHelper.deleteMailUser(req.user)
        await catHelper.updateOwner(req.user)
        await catHelper.deleteCat(req.user)
        await RefreshToken.destroy({where: {userId: req.user.id}})
        const image = await Image.findOne({where: {id: req.user.imageId}})
        await req.user.destroy()
        await fileHelper.deleteImage(image)
        const address = await Address.findByPk(req.user.addressId)
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

module.exports = {getOneUser, editUser, editAddressUser, editUsername, editPassword, deleteUser}