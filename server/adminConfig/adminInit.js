const fs = require('fs')
const path = require('path')
const { User } = require('../models')
const {hash} = require("bcrypt")

const initializeAdmin = async () => {
    try {
        const count = await User.count()
        if (count === 0) {
            const adminData = fs.readFileSync(path.join(__dirname, 'admin.json'), 'utf8')
            const adminUser = JSON.parse(adminData)
            const adminDetails = adminUser.admin

            const hashedPassword = await hash(adminDetails.password, 10)
            await User.create({
                firstName: adminDetails.firstname,
                lastName: adminDetails.lastname,
                username: adminDetails.username,
                password: hashedPassword,
                email: adminDetails.email,
                birthday: adminDetails.birthday,
                role: adminDetails.role,
                status: adminDetails.status
            })
            console.log('Admin user created')
        }
    } catch (error) {
        console.error('Error initializing admin user:', error)
    }
}

initializeAdmin()
