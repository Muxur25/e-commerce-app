const Cart = require('../models/Cart')
const Product = require('../models/Product')

exports.getCart = async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user.id }).populate(
			'products.productId'
		)
		// res.json(cart)
		if (!cart) {
			return res.render('cart/index', {
				cart: { products: [] },
				title: 'Your Cart',
				user: req.user,
				totalPrice: 0,
			})
		}
		let totalPrice = cart.products.reduce((sum, item) => {
			return sum + item.productId.price * item.quantity
		}, 0)
		totalPrice = totalPrice.toFixed(2)
		res.render('cart/index', {
			cart,
			title: 'Cards',
			user: req.user,
			totalPrice,
		})
	} catch (err) {
		res.status(400).send(err.message)
	}
}

exports.addToCart = async (req, res) => {
	try {
		const { productId } = req.params
		const { quantity } = req.body
		let cart = await Cart.findOne({ user: req.user.id })

		if (!cart) {
			cart = new Cart({ user: req.user.id, products: [] })
		}

		const product = await Product.findById(productId)
		if (!product) return res.status(404).send('Product not found')

		const cartItemIndex = cart.products.findIndex(
			item => item.productId.toString() === productId
		)

		if (cartItemIndex > -1) {
			cart.products[cartItemIndex].quantity += Number(quantity)
		} else {
			cart.products.push({ productId, quantity: Number(quantity) })
		}

		await cart.save()
		// res.json(cart)
		res.redirect('/cart')
	} catch (err) {
		res.status(400).send(err.message)
	}
}

exports.removeFromCart = async (req, res) => {
	try {
		const { productId } = req.params
		let cart = await Cart.findOne({ user: req.user.id })

		if (!cart) return res.status(404).send('Cart not found')

		cart.products = cart.products.filter(
			item => item.productId.toString() !== productId
		)

		await cart.save()
		// res.json(cart)
		res.redirect('/cart')
	} catch (err) {
		res.status(400).send(err.message)
	}
}
