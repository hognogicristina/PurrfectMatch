const {Cat} = require("../../models")
const {Op} = require("sequelize")

const processAgeRange = (age) => {
    if (!age) return null
    for (const type in CONSTANTS) {
        const range = CONSTANTS[type].RANGE
        if (age >= range.MIN && (range.MAX === null || age <= range.MAX)) {
            return CONSTANTS[type].TYPE
        }
    }
}

const updateCatData = async (cat, body) => {
    if (!body) return
    const fields = ['name', 'breed', 'gender', 'age', 'healthProblem', 'description']
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const ageInSeconds = currentTimestamp - body.age
    const ageInYears = ageInSeconds / (60 * 60 * 24 * 365)

    cat.age = ageInYears
    cat.ageType = processAgeRange(ageInYears)

    for (const field of fields) {
        if (field in body) {
            cat[field] = body[field]
        }
    }
    return cat
}

const filterCats = async (req) => {
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : null
    const selectedBreed = req.query.selectedBreed ? req.query.selectedBreed : null
    const selectedAgeType = req.query.selectedAgeType ? req.query.selectedAgeType : null
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
    if (selectedAgeType) {
        queryOptions.where = {...queryOptions.where, ageType: {[Op.like]: `%${selectedAgeType}%`}}
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
            comparison = cat1.age.localeCompare(cat2.age)
        }
        return sortOrder === 'asc' ? comparison : -comparison
    })

    return cats
}

module.exports = {processAgeRange, updateCatData, filterCats}