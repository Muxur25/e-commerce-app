const BaseError = require('../error/baseError')

module.exports = function (err, req, res, next) {
	if (err instanceof BaseError) {
		return res
			.status(err.status)
			.json({ message: err.message, error: err.error })
	}

	console.error(err.message)
	return res.status(500).json({ message: 'Server Error' })
}
