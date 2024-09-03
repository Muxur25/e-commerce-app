const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()
const { body } = require('express-validator')

router.get('/login', (req, res) =>
	res.render('auth/login', {
		title: 'login',
		user: req.user,
		error: null,
		oldEmail: null,
	})
)
router.get('/register', (req, res) =>
	res.render('auth/register', {
		title: 'register',
		user: req.user,
		error: null,
		oldUsername: null,
		oldEmail: null,
	})
)
router.post(
	'/register',
	body('email', 'Email is not validation').isEmail(),
	body('password', 'Passwort is not validate').isLength({ min: 4, max: 12 }),
	authController.register
)
router.post(
	'/login',
	body('email', 'Email is not validation').isEmail(),
	body('password', 'Passwort is not validate').isLength({ min: 4, max: 12 }),
	authController.login
)
router.get('/logout', authController.logout)

module.exports = router
