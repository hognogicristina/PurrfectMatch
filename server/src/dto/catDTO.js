const {User, Address, Image} = require('../../models')

async function transformCatToDTO(cat) {
    const image = await Image.findOne({ where: { id: cat.imageId } })
    const guardian = await User.findByPk(cat.userId)
    const owner = await User.findByPk(cat.ownerId)
    const address = await Address.findOne({ where: { id: guardian.addressId } })

    return {
        name: cat.name,
        image: image ? image.url : null,
        breed: cat.breed,
        gender: cat.gender,
        age: cat.age,
        healthProblem: cat.healthProblem ? cat.healthProblem : null,
        description: cat.description,
        user: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
        owner: owner ? `${owner.firstName} ${owner.lastName}` : null,
        address: address ? address.country : null,
        city: address ? address.city : null,
    }
}

async function transformCatsToDTO(cat) {
    return {
        name: cat.name,
        breed: cat.breed,
        gender: cat.gender,
        age: cat.age,
    }
}

module.exports = {transformCatToDTO, transformCatsToDTO}