const cron = require('node-cron')
const {Mail} = require('../../models')
const {Op} = require('sequelize')

const setupMailCronJob = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running a daily check to delete old mails.')
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

        await Mail.destroy({
            where: {
                updatedAt: {
                    [Op.lt]: oneMonthAgo
                }
            }
        })
    })
}

module.exports = setupMailCronJob