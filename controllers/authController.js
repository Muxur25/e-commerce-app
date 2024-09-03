const bcryptjs = require('bcryptjs')
const UserDto = require('../dto/user.dto')
const BaseError = require('../error/baseError')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
class AuthController {
	async register(req, res, next) {
		try {
			const { username, email, password, password2 } = req.body
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.render('auth/register', {
					error: errors.array()[0].msg,
					oldEmail: email,
					oldUsername: username,
					user: req.user,
				})
			}
			if (password !== password2) {
				return res.render('auth/register', {
					error: 'Password invalid',
					oldEmail: email,
					oldUsername: username,
					user: req.user,
				})
			}
			const user = await User.create({ username, email, password })
			const userDto = new UserDto(user)
			const token = jwt.sign(
				{ user: userDto.username, id: userDto.id },
				process.env.JWT_SECRET,
				{ expiresIn: '30d' }
			)
			res.cookie('refreshToken', token, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})
			// res.json({ user: userDto, token })
			res.redirect('/auth/login')
		} catch (error) {
			res.render('auth/register', {
				error: 'Invalid registration',
				oldEmail: null,
				oldUsername: null,
				user: req.user,
			})
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.render('auth/login', {
					error: errors.array()[0].msg,
					oldEmail: email,
					user: req.user,
				})
			}
			if (!email || !password) {
				return res.render('auth/login', {
					error: 'email or password not entered',
					oldEmail: email,
					user: req.user,
				})
			}
			const isUser = await User.findOne({ email })
			if (!isUser) {
				return res.render('auth/login', {
					error: 'user is not defained',
					oldEmail: email,
					user: req.user,
				})
			}

			const isPassword = await bcryptjs.compare(password, isUser.password)
			if (!isPassword) {
				return res.render('auth/login', {
					error: 'password invalid',
					oldEmail: email,
					user: req.user,
				})
			}
			const userDto = new UserDto(isUser)
			const token = jwt.sign(
				{ user: userDto.username, id: userDto.id },
				process.env.JWT_SECRET,
				{ expiresIn: '30d' }
			)
			res.cookie('refreshToken', token, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})
			// res.json({ user: userDto, token })
			res.redirect('/products')
		} catch (error) {
			res.render('auth/login', {
				error: 'Invalid login',
				oldEmail: null,
				user: req.user,
			})
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const isToken = jwt.verify(refreshToken, process.env.JWT_SECRET)
			if (!isToken) {
				throw BaseError.Unauthorization()
			}
			res.clearCookie('refreshToken')
			// res.json({ message: 'Logout' })
			res.redirect('/auth/login')
		} catch (error) {
			res.render('auth/login', {
				error: 'Invalid logout',
				oldEmail: null,
				user: req.user,
			})
		}
	}
}

module.exports = new AuthController()
