const {Image, Address, Cat, CatUser, Mail, UserMail, RefreshToken, PasswordHistory} = require("../../models")
const fileHelper = require("./fileHelper")

const deleteUser = async (user) => {
    await RefreshToken.destroy({where: {userId: user.id}})
    await PasswordHistory.destroy({where: {userId: user.id}})
    const userMails = await UserMail.findAll({where: {userId: user.id}})
    for (let userMail of userMails) {
        const mail = await Mail.findByPk(userMail.mailId)
        await userMail.destroy()
        await mail.destroy()
    }
    await CatUser.destroy({where: {userId: user.id}})
    await CatUser.destroy({where: {ownerId: user.id}})
    await Cat.destroy({where: {userId: user.id}})
    await Cat.destroy({where: {ownerId: user.id}})
    const address = await Address.findByPk(user.addressId)
    const image = await Image.findByPk(user.imageId)
    await user.destroy()
    if (address) await address.destroy()
    await fileHelper.deleteImage(image)
}

const deleteCat = async (cat) => {
    const catUsers = await CatUser.findAll({where: {catId: cat.id}})
    for (let catUser of catUsers) {
        await catUser.destroy()
    }
    const mails = await Mail.findAll({where: {catId: cat.id}})
    for (let mail of mails) {
        const userMails = await UserMail.findAll({where: {mailId: mail.id}})
        for (let userMail of userMails) {
            await userMail.destroy()
        }
        await mail.destroy()
    }
    const image = await Image.findByPk(cat.imageId)
    await cat.destroy()
    await fileHelper.deleteImage(image)
}

module.exports = {deleteUser, deleteCat}