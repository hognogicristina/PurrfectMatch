const fs = require("fs")
const path = require("path")
const {Breed} = require('../../models')

async function addBreedsToDatabase() {
    try {
        const count = await Breed.count()
        const breedData = fs.readFileSync(path.join(__dirname, 'breeds.json'), 'utf8')
        const breeds = JSON.parse(breedData)

        if (count === 0) {
            for (const breed of breeds) {
                await Breed.create({
                    name: breed,
                })
            }
            console.log('All breeds added successfully!')
        } else {
            const existingBreeds = await Breed.findAll({attributes: ['name']})
            const existingBreedNames = existingBreeds.map(b => b.name)

            const newBreeds = breeds.filter(breed => !existingBreedNames.includes(breed))

            if (newBreeds.length > 0) {
                for (const breed of newBreeds) {
                    await Breed.create({name: breed})
                    console.log(`Added ${breed} to the database.`)
                }
                console.log('New breeds added successfully!')
            } else {
                console.log('No new breeds to add.')
            }
        }
    } catch (error) {
        console.error('Error adding breeds to database:', error)
    }
}

addBreedsToDatabase()
