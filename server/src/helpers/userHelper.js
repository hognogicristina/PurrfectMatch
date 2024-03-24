const {Image, Address, RefreshToken} = require("../../models")
const emailService = require("../services/emailService")
const mailHelper = require("./mailHelper")
const catUserHelper = require("./catUserHelper")
const fileHelper = require("./fileHelper")

const deleteUser = async (user) => {
    await emailService.sendDeleteAccount(user)
    await mailHelper.deleteMailUser(user)
    await catUserHelper.updateOwner(user)
    await catUserHelper.deleteCat(user)
    await RefreshToken.destroy({where: {userId: user.id}})
    const image = await Image.findOne({where: {id: user.imageId}})
    await user.destroy()
    await fileHelper.deleteImage(image)
    const address = await Address.findByPk(user.addressId)
    if (address) {
        await address.destroy()
    }
}

module.exports = {deleteUser}