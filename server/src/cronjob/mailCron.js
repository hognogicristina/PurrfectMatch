const cron = require('node-cron')
const {Op} = require('sequelize')
const {Mail} = require('../../models')

const setupMailCronJob = () => {
    cron.schedule('0 0 * * 0', async () => {
        try {
            console.log('Running a weekly check to delete old mails')
            const oneMonthAgo = new Date()
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

            await Mail.destroy({
                where: {
                    updatedAt: {
                        [Op.lt]: oneMonthAgo
                    }
                }
            })

            console.log('Old mails deleted successfully')
        } catch (error) {
            console.error('Error occurred while deleting old mails: ', error)
        }
    })
}

module.exports = setupMailCronJob