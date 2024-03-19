const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require("cookie-parser")
const fs = require('fs')
const setupMailCronJob = require('./src/cronjob/mailcron')
const setupPasswordCronJob = require('./src/cronjob/passwordcron')

require('dotenv').config({path: './.env'})
// Comment the line below if you want to use the .env file and not the .env.local file
require('dotenv').config({path: './.env.local', override: true})

const {sequelize} = require('./models')
const routes = require('./src/routes/routes')

const dir = path.join(__dirname, 'public/files')
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true})
}

app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/', routes)
app.use('/files', express.static('public/files'))
setupMailCronJob()
setupPasswordCronJob()

const PORT = process.env.PORT || 3000

const startApp = async () => {
    try {
        await sequelize.sync()
        console.log('Database connected and models synced!')

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

startApp()