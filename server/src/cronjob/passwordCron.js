const cron = require('node-cron')
const {Op} = require("sequelize")
const {User, PasswordHistory} = require('../../models')

const setupPasswordCronJob = () => {
    cron.schedule('0 0 * * 0', async () => {
        try {
            console.log('Running a weekly check to delete old password records')
            const daysToKeep = 30
            const dateThreshold = new Date()
            dateThreshold.setDate(dateThreshold.getDate() - daysToKeep)

            await PasswordHistory.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: dateThreshold
                    },
                    '$User.password$': null,
                    password: {
                        [Op.not]: User.sequelize.literal('`User`.`password`')
                    }
                },
                include: [{
                    model: User,
                    required: false
                }]
            })

            console.log('Old password records deleted successfully')
        } catch (error) {
            console.error('Error occurred while deleting old password records: ', error)
        }
    })
}

module.exports = setupPasswordCronJob