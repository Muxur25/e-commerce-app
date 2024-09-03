const express = require('express')
const orderController = require('../controllers/orderController')
const { authenticate } = require('../middlewares/auth')
const router = express.Router()

router.post('/place', authenticate, orderController.placeOrder)
router.get('/', authenticate, orderController.getOrderHistory)

module.exports = router
