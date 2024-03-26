const cron = require('node-cron')
const {Op} = require('sequelize')
const {AdoptionRequest} = require('../../models')

const setupAdoptionRequestCronJob = () => {
    cron.schedule('0 0 * * 0', async () => {
        try {
            console.log('Running a weekly check to delete old adoption requests')
            const oneMonthAgo = new Date()
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

            await AdoptionRequest.destroy({
                where: {
                    updatedAt: {
                        [Op.lt]: oneMonthAgo
                    }
                }
            })

            console.log('Old adoption requests deleted successfully')
        } catch (error) {
            console.error('Error occurred while deleting old adoption requests: ', error)
        }
    })
}

module.exports = setupAdoptionRequestCronJob