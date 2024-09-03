const jwt = require('jsonwebtoken')
const User = require('../models/User')
const UserDto = require('../dto/user.dto')

exports.authenticate = async (req, res, next) => {
	const { refreshToken } = req.cookies
	if (!refreshToken) return res.redirect('/auth/login')

	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
		const data = await User.findById(decoded.id)
		if (!data) return res.redirect('/auth/login')

		req.user = new UserDto(data)
		next()
	} catch (err) {
		res.redirect('/auth/login')
	}
}
