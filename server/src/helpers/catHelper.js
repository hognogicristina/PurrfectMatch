const fs = require("fs")
const path = require("path")
const {Cat} = require("../../models")
const {Op} = require("sequelize")

const processAgeRange = (age) => {
    if (!age) return null
    const ageRanges = JSON.parse(fs.readFileSync((path.join('./data', 'ageRanges.json')), 'utf-8'))
    const ageRange = ageRanges[age]
    if (ageRange.max === null) {
        return age + ` (${ageRange.min}+ years)`
    } else {
        return age + ` (${ageRange.min}-${ageRange.max} years)`
    }
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

const filterCats = async (req) => {
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : null
    const selectedBreed = req.query.selectedBreed ? req.query.selectedBreed : null
    const selectedAge = req.query.selectedAge ? req.query.selectedAge : null
    const selectedGender = req.query.selectedGender ? req.query.selectedGender : null
    const selectedNoHealthProblem = req.query.selectedNoHealthProblem !== undefined
    const sortBy = req.query.sortBy ? req.query.sortBy : 'breed'
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'asc'
    let cats
    let queryOptions = {}

    if (searchQuery) {
        queryOptions.where = {[Op.or]: [{breed: {[Op.like]: `%${searchQuery}%`}}, {healthProblem: {[Op.like]: `%${searchQuery}%`}}]}
    }
    if (selectedBreed) {
        queryOptions.where = {...queryOptions.where, breed: selectedBreed}
    }
    if (selectedAge) {
        queryOptions.where = {...queryOptions.where, age: {[Op.like]: `%${selectedAge}%`}}
    }
    if (selectedGender) {
        queryOptions.where = {...queryOptions.where, gender: selectedGender}
    }
    if (selectedNoHealthProblem) {
        queryOptions.where = {...queryOptions.where, healthProblem: null}
    }

    cats = await Cat.findAll(queryOptions)
    cats.sort((cat1, cat2) => {
        let comparison = 0
        if (sortBy === 'breed') {
            comparison = cat1.breed.localeCompare(cat2.breed)
        } else if (sortBy === 'age') {
            const age1 = parseInt(cat1.age.match(/\d+/)[0])
            const age2 = parseInt(cat2.age.match(/\d+/)[0])
            comparison = age1 - age2
        }
        return sortOrder === 'asc' ? comparison : -comparison
    })

    return cats
}

module.exports = {processAgeRange, updateCatData, filterCats}