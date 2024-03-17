const validator = require('validator')
const fs = require('fs')
const path = require("path")
const {Cat} = require('../../models')

const catExistValidator = async (req, res) => {
    const cats = await Cat.findAll()

    if (req.params.id) {
        const cat = await Cat.findByPk(req.params.id)
        if (!cat) {
            return res.status(404).json({error: 'Cat not found!'})
        }
    } else {
        if (cats.length === 0) {
            return res.status(404).json({error: 'No cats found!'})
        }
    }

    return null
}

const userValidator = async (req, res) => {
    if (req.method !== 'POST') {
        const cat = await Cat.findByPk(req.params.id)
        if (!cat) {
            return res.status(404).json({error: 'Cat not found'})
        }

        const user = req.user
        if (cat.ownerId === null) {
            if (cat.userId !== user.id) {
                return res.status(403).json({error: 'You are not authorized to perform this action'})
            }
        } else {
            if (cat.ownerId !== user.id) {
                return res.status(403).json({error: 'You are not authorized to perform this action'})
            }
        }
    }

    if (req.method === 'POST') {
        const user = req.user
        if (!user.addressId) {
            return res.status(403).json({error: 'Address is required in order for you to add a cat'})
        }
    }

    return null
}

const catValidator = async (req, res) => {
    const errors = []

    if (validator.isEmpty(req.body.name || '')) {
        errors.push({field: 'name', error: 'Name is required!'})
    } else if (!validator.isLength(req.body.name, {min: 3})) {
        errors.push({field: 'name', error: 'Name must be at least 3 characters long!'})
    }

    const breeds = JSON.parse(fs.readFileSync((path.join('./data', 'breeds.json')), 'utf-8'))
    if (validator.isEmpty(req.body.breed || '')) {
        errors.push({field: 'breed', error: 'Breed is required!'})
    } else if (!breeds.includes(req.body.breed)) {
        errors.push({field: 'breed', error: 'Breed is not valid!'})
    }

    if (validator.isEmpty(req.body.gender || '')) {
        errors.push({field: 'gender', error: 'Gender is required!'})
    } else if (!['Male', 'Female'].includes(req.body.gender)) {
        errors.push({field: 'gender', error: 'Gender must be either Male or Female'})
    }

    const categories = Object.keys(JSON.parse(fs.readFileSync((path.join('./data', 'ageRanges.json')), 'utf-8')))
    if (validator.isEmpty(req.body.age || '')) {
        errors.push({field: 'age', error: 'Age is required!'})
    } else if (!categories.includes(req.body.age)) {
        errors.push({field: 'age', error: 'Age is not valid! (e.g. Kitten, Young Adult, Mature Adult, Senior)'})
    }

    if (validator.isEmpty(req.body.description || '')) {
        errors.push({field: 'description', error: 'Description is required!'})
    } else if (!validator.isLength(req.body.description, {min: 5})) {
        errors.push({field: 'description', error: 'Description must be at least 5 characters long!'})
    }

    if (!req.file) {
        errors.push({field: 'file', error: 'Image is required!'})
    } else {
        const maxSize = 5 * 1024 * 1024
        if (req.file.size > maxSize) {
            errors.push({field: 'file', error: 'File size should not exceed 5MB'})
        }

        const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1)
        const allowedTypes = /jpeg|jpg|png|gif/i
        if (!allowedTypes.test(extension)) {
            errors.push({field: 'file', error: 'Only image files are allowed!'})
        }
    }

    return errors.length > 0 ? res.status(400).json({errors}) : null
}

module.exports = {
    catExistValidator,
    userValidator,
    catValidator
}