const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const main = require('./routers/main')
const path = require('path')
const cookieParser = require('cookie-parser')

require('./db/mongoose')

const app = express()
const port = process.env.PORT

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// Pass incomming Json to object
app.use(express.json())
app.use(cookieParser())

// Set router
app.use(userRouter)
app.use(taskRouter)
app.use(main)

// View engine
app.set('view engine', 'ejs')

// Listen
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})