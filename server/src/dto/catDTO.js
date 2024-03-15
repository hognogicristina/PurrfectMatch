const {User, Address} = require('../../models')

async function transformCatToDTO(cat) {
    let userInfo = {}

    if (cat.ownerId) {
        const owner = await User.findByPk(cat.ownerId)
        userInfo = {
            firstName: owner.firstName,
            lastName: owner.lastName,
        }
    } else if (cat.userId) {
        const user = await User.findByPk(cat.userId)
        const address = await Address.findOne({where: {id: user.addressId}})
        userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            country: address.country,
            city: address.city,
        }
    }

    const catInfo = {
        name: cat.name,
        breed: cat.breed,
        gender: cat.gender,
        age: cat.age,
        healthProblem: cat.healthProblem,
        description: cat.description
    }

    return {
        catInfo,
        userInfo
    }
}

module.exports = {
    transformCatToDTO,
}