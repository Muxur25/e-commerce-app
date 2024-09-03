const Order = require('../models/Order')
const Cart = require('../models/Cart')

exports.placeOrder = async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user.id }).populate(
			'products.productId'
		)

		if (!cart || cart.products.length === 0) {
			return res.redirect('/cart')
		}

		const order = new Order({
			user: req.user.id,
			products: cart.products.map(p => ({
				product: p.productId._id,
				quantity: p.quantity,
			})),
		})

		await order.save()
		cart.products = []
		await cart.save()

		// res.json({ cart, order })
		res.redirect('/orders')
	} catch (error) {
		res.status(500).send('Error placing order: ' + error.message)
	}
}

exports.getOrderHistory = async (req, res) => {
	try {
		// Foydalanuvchiga oid barcha buyurtmalarni olish va mahsulotlarni populatsiya qilish
		const orders = await Order.find({ user: req.user.id }).populate(
			'products.product'
		)

		// Har bir buyurtma uchun totalPrice hisoblash
		const ordersWithTotalPrice = orders.map(order => {
			const totalPrice = order.products
				.reduce((sum, item) => {
					return sum + item.product.price * item.quantity
				}, 0)
				.toFixed(2)

			return {
				...order.toObject(),
				totalPrice,
			}
		})

		// Rendering
		res.render('orders/index', {
			orders: ordersWithTotalPrice,
			title: 'Order History',
			user: req.user,
		})
		// res.json(ordersWithTotalPrice)
	} catch (error) {
		res.status(500).send('Error fetching order history: ' + error.message)
	}
}
