// Environment Variable
require('dotenv').config()
require('express-async-errors')

// Express
const express = require('express')
const app = express();

// rest of the packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// Database
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())

// Home route
app.get('/api/v1',(req,res)=>{
    console.log(req.signedCookies);
    res.send('e-commerce api')
})

// routes
app.use('/api/v1/auth/',authRouter)
app.use('/api/v1/users/',userRouter)
app.use('/api/v1/products/',productRouter)
app.use('/api/v1/reviews',reviewRouter)

// Error Handlers
app.use(notFoundMiddleware)
//  Not found should come before error handlers
//  Error Handler middleware handle error i.e thrown from one of the routes
app.use(errorHandlerMiddleware)

// Port
const port = process.env.PORT || 5000
const start = async() =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening on port ${port}...`))
    }
    catch(error){
        console.log(error);
    }
}
start()