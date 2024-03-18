const fs = require("fs")
const path = require("path")
const {CatUser, Cat, Image} = require("../../models");
const fileHelper = require("./fileHelper")

const processAgeRange = (age) => {
    if (!age) return null
    const ageRanges = JSON.parse(fs.readFileSync((path.join('./data', 'ageRanges.json')), 'utf-8'))
    const ageRange = ageRanges[age]
    return age + ` (${ageRange.min}-${ageRange.max} years)`
}

const updateCatData = async (cat, body) => {
    if (!body) return
    const fields = ['name', 'breed', 'gender', 'age', 'healthProblem', 'description']
    fields.forEach(field => {
        if (body[field] !== undefined) {
            cat[field] = field === 'age' ? processAgeRange(body[field]) : body[field]
        }
    })
    return cat
}

const updateOwner = async (user) => {
    if (!user) return
    const cats = await Cat.findAll({where: {userId: user.id}})

    if (cats.length > 0) {
        for (let cat of cats) {
            const catUsers = await CatUser.findAll({where: {catId: cat.id}})
            for (let catUser of catUsers) {
                if (catUser.ownerId !== null) {
                    catUser.userId = null
                    await catUser.save()
                }
            }

            if (cat.ownerId !== null) {
                cat.userId = null
                await cat.save()
            }
        }
    }
}

const deleteCat = async (user) => {
    if (!user) return
    const cats = await Cat.findAll({where: {userId: user.id}})

    if (cats.length > 0) {
        for (let cat of cats) {
            const catUsers = await CatUser.findAll({where: {catId: cat.id}})
            for (let catUser of catUsers) {
                await catUser.destroy()
            }

            const image = await Image.findOne({where: {id: cat.imageId}})
            await cat.destroy()
            await fileHelper.deleteImage(image)
        }
    } else {
        const catOwners = await Cat.findAll({where: {ownerId: user.id}})

        if (catOwners.length > 0) {
            for (let catOwner of catOwners) {
                const catUserOwners = await CatUser.findAll({where: {catId: catOwner.id}})
                for (let catUserOwner of catUserOwners) {
                    await catUserOwner.destroy()
                }

                const image = await Image.findOne({where: {id: catOwner.imageId}})
                await catOwner.destroy()
                await fileHelper.deleteImage(image)
            }
        }
    }
}

module.exports = {processAgeRange, updateCatData, updateOwner, deleteCat}