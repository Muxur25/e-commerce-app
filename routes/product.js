const express = require('express')
const productController = require('../controllers/productController')
const { authenticate } = require('../middlewares/auth')
const router = express.Router()

router.get('/add-page', (req, res) =>
	res.render('products/add', { user: req.user, message: null })
)
router.get('/', authenticate, productController.getAllProducts)
router.get('/:id', authenticate, productController.getProductById)
router.post('/', productController.addProduct)

module.exports = router
