require('dotenv').config()
require('express-async-errors')
const express = require('express')

const app = express()

// Rest of the Packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// Database Connection
const connectDB = require('./db/connect')

// Routers

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')

// Error Middleware

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())

app.get('/', (req, res) => {
  res.send('<h1>Hello World')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async function () {
  try {
    await connectDB(process.env.MONGO_URL)
    console.log(`App is listening on ${port}`)
    app.listen(port)
  } catch (error) {
    console.error('There was an error', error)
  }
}

start()
