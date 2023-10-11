import CustomError from "../utils/error/CustomError.js"
import EErrors from "../utils/error/enum.js"

export default (req, res, next) => {
	try {
		req.cookies.token ? CustomError.createError({
			name: 'Login Error',
			cause: 'You are already logged in',
			message: 'Login Error',
			code: EErrors.VALIDATION_ERROR
		}) : next()
	} catch (error) {
		next(error)
	}
}