const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')
const User = require('./models/User')
require('dotenv').config()
const expressJslayouts = require('express-ejs-layouts')
const app = express()

// Set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressJslayouts)
app.set('layout', 'layout/main')
// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

app.use('/', (req, res) => {
	res.redirect('/auth/login')
})

// Connect to MongoDB and start the server
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(3000, () => console.log('Server running on port 3000'))
	)
	.catch(err => console.error(err))
