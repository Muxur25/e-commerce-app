module.exports = class BaseError extends Error {
	status
	error
	constructor(status, message, error) {
		super(message)
		this.status = status
		this.error = error
	}

	static Unauthorization() {
		return new BaseError(401, 'Unauthorization')
	}

	static Error(message, error = []) {
		return new BaseError(400, message, error)
	}
}
