const fs = require('fs')
const path = require('path')
const {User, PasswordHistory} = require('../models')
const {hash} = require("bcrypt")

const initializeAdmin = async () => {
    try {
        const count = await User.count()
        if (count === 0) {
            const adminData = fs.readFileSync(path.join(__dirname, 'admin.json'), 'utf8')
            const adminUser = JSON.parse(adminData)
            const adminDetails = adminUser.admin

            const hashedPassword = await hash(adminDetails.password, 10)
            const user = await User.create({
                firstName: adminDetails.firstName,
                lastName: adminDetails.lastName,
                username: adminDetails.username,
                password: hashedPassword,
                email: adminDetails.email,
                birthday: adminDetails.birthday,
                role: adminDetails.role,
                status: adminDetails.status
            })
            await PasswordHistory.create({
                userId: user.id,
                password: hashedPassword
            })
            console.log('Admin user created')
        }
    } catch (error) {
        console.error('Error initializing admin user:', error)
    }
}

await initializeAdmin()
