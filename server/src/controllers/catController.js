const fs = require("fs")
const path = require('path')
const {Cat, Image, CatUser, Mail, UserMail, User} = require('../../models')
const catValidator = require('../validators/catValidator')
const emailService = require('../services/emailService')
const {transformCatToDTO} = require('../dto/catDTO')

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
        const catData = {}
        const fieldsForCat = ['name', 'breed', 'gender', 'age', 'healthProblem', 'description']
        fieldsForCat.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'age') {
                    const ageRanges = JSON.parse(fs.readFileSync((path.join('./data', 'ageRanges.json')), 'utf-8'))
                    const ageRange = ageRanges[req.body.age]
                    req.body.age = req.body.age + ` (${ageRange.min}-${ageRange.max} years)`
                }
                catData[field] = req.body[field]
            }
        })

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const extension = path.extname(req.file.originalname)
        const filename = `${uniqueSuffix}${extension}`
        const address = `${process.env.SERVER_BASE_URL}`
        const imagePath = path.join('public', 'files', filename)
        const imageUrl = `${address}/files/${filename}`

        const image = new Image()
        image.filename = filename
        image.filetype = extension.replace('.', '')
        image.filesize = req.file.size
        image.url = imageUrl
        await image.save()

        catData.imageId = image.id
        catData.userId = req.user.id
        const newCat = await Cat.create(catData)

        const catUser = new CatUser({
            catId: newCat.id,
            userId: req.user.id
        })
        await catUser.save()

        fs.writeFileSync(imagePath, req.file.buffer)
        res.status(201).json({status: 'Cat added successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const editCat = async (req, res) => {
    try {
        if (await catValidator.catValidator(req, res)) return
        if (await catValidator.userValidator(req, res)) return
        const fieldsToUpdate = ['name', 'breed', 'gender', 'age', 'healthProblem', 'description']
        const cat = await Cat.findByPk(req.params.id)
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'age') {
                    const ageRanges = JSON.parse(fs.readFileSync((path.join('./data', 'ageRanges.json')), 'utf-8'))
                    const ageRange = ageRanges[req.body.age]
                    req.body.age = req.body.age + ` (${ageRange.min}-${ageRange.max} years)`
                }
                cat[field] = req.body[field]
            }
        })

        if (req.file) {
            let image = await Image.findByPk(cat.imageId)
            const oldImagePath = path.join('public', 'files', image.filename)
            fs.unlinkSync(oldImagePath)

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

            cat.imageId = image.id
            await cat.save()
            fs.writeFileSync(imagePath, req.file.buffer)
        }

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
        const receiver = req.user
        const mails = await Mail.findAll({where: {catId: cat.id}})

        for (const mail of mails) {
            if (mail.status === 'pending') {
                const userMails = await UserMail.findAll({where: {mailId: mail.id}})
                for (let userMail of userMails) {
                    if (userMail.role === 'sender') {
                        const sender = await User.findOne({where: {id: userMail.userId}})
                        await emailService.sendDeclineAdoption(sender, receiver, cat)
                    }
                }
                await UserMail.destroy({where: {mailId: mail.id}})
                await mail.destroy()
            } else {
                await UserMail.destroy({where: {mailId: mail.id}})
                await mail.destroy()
            }
        }

        await CatUser.destroy({where: {catId: cat.id}})

        const image = await Image.findOne({where: {id: cat.imageId}})
        const imagePath = path.join('public', 'files', image.filename)
        await fs.unlinkSync(imagePath)

        await cat.destroy()
        await image.destroy()
        await transaction.commit()
        return res.status(200).json({status: 'Cat deleted successfully'})
    } catch (error) {
        await transaction.rollback()
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {
    getAllCats,
    getOneCat,
    addCat,
    editCat,
    deleteCat
}