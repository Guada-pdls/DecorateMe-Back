import CustomError from "../utils/error/CustomError.js"
import EErrors from "../utils/error/enum.js"

export default (req, res, next) => {
	req.cookies.token ? CustomError.createError({
		name: 'Login Error',
		cause: 'You are already logged in',
		message: 'Error creating session',
		code: EErrors.VALIDATION_ERROR
	}) : next()
}