const {Cat, Image, CatUser} = require('../../models')
const catValidator = require('../validators/catValidator')
const {transformCatToDTO} = require('../dto/catDTO')
const catHelper = require('../helpers/catHelper')
const fileHelper = require('../helpers/fileHelper')
const mailHelper = require('../helpers/mailHelper')

const getAllCats = async (req, res) => {
    try {
        if (await catValidator.catExistValidator(req, res)) return
        const cats = await Cat.findAll()
        return res.status(200).json({data: cats})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const getOneCat = async (req, res) => {
    try {
        if (await catValidator.catExistValidator(req, res)) return
        const cat = await Cat.findByPk(req.params.id)
        const catDTO = await transformCatToDTO(cat)
        return res.status(200).json({data: catDTO})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const addCat = async (req, res) => {
    try {
        if (await catValidator.catValidator(req, res)) return
        if (await catValidator.userValidator(req, res)) return

        let catData = {}
        catData = await catHelper.updateCatData(catData, req.body)
        catData.imageId = await fileHelper.updateImage(catData, req.file)

        catData.userId = req.user.id
        const newCat = await Cat.create(catData)
        await CatUser.create({catId: newCat.id, userId: req.user.id})

        res.status(201).json({status: 'Cat added successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editCat = async (req, res) => {
    try {
        if (await catValidator.catValidator(req, res)) return
        if (await catValidator.userValidator(req, res)) return

        let cat = await Cat.findByPk(req.params.id)
        cat = await catHelper.updateCatData(cat, req.body)
        cat.imageId = await fileHelper.updateImage(cat, req.file)
        await cat.save()

        return res.json({status: 'Cat updated successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const deleteCat = async (req, res) => {
    const transaction = await Cat.sequelize.transaction()
    try {
        if (await catValidator.userValidator(req, res)) {
            await transaction.rollback()
            return
        }

        const cat = await Cat.findByPk(req.params.id)
        const image = await Image.findByPk(cat.imageId)

        await mailHelper.deleteMailCat(cat, req.user)
        await CatUser.destroy({where: {catId: cat.id}})
        await cat.destroy()
        await fileHelper.deleteImage(image)

        await transaction.commit()
        return res.status(200).json({status: 'Cat deleted successfully'})
    } catch (error) {
        await transaction.rollback()
        console.log(error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {getAllCats, getOneCat, addCat, editCat, deleteCat}