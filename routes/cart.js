const express = require('express')
const cartController = require('../controllers/cartController')
const { authenticate } = require('../middlewares/auth')
const router = express.Router()

router.get('/', authenticate, cartController.getCart)
router.post('/add/:productId', authenticate, cartController.addToCart)
router.post('/remove/:productId', authenticate, cartController.removeFromCart)

module.exports = router
