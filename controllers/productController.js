const BaseError = require('../error/baseError')
const Product = require('../models/Product')
const { validationResult } = require('express-validator')

class ProductController {
	async getAllProducts(req, res, next) {
		try {
			const products = await Product.find()
			res.render('products/index', {
				products,
				title: 'Products',
				user: req.user,
			})
			// res.json(products)
		} catch (err) {
			next(err)
		}
	}

	async getProductById(req, res, next) {
		try {
			const product = await Product.findById(req.params.id)
			if (!product) throw BaseError.Error('Maxsulot topilmadi')
			res.render('products/details', {
				product,
				title: 'Products',
				user: req.user,
			})
			// res.json(product)
		} catch (err) {
			next(err)
		}
	}

	async addProduct(req, res, next) {
		try {
			const { name, price, description, imageUrl } = req.body
			if (!name || !price || !description || !imageUrl) {
				return res.render('products/add', {
					message: 'nimadurni kiritishni unuttingiz',
					user: req.user,
				})
			}
			await Product.create({ name, price, description, imageUrl })
			// res.json(data)
			res.render('products/add', {
				message: 'Maxsulot qoshildi',
				user: req.user,
			})
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new ProductController()
