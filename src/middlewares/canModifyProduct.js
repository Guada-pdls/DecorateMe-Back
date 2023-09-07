import { productService } from "../service/index.js"
import CustomError from "../utils/error/CustomError.js"
import EErrors from "../utils/error/enum.js"

export default async (req, res, next) => {
	try {
		if (req.user.role === 'admin') return next()

		const pid = req.params.pid
		const product = await productService.getProduct(pid)

		if (!(product.owner === req.user.email)) CustomError.createError({
			name: 'Modify product error',
			cause: 'Cannot modify product',
			message: 'You must be the product owner or an admin to delete this',
			code: EErrors.VALIDATION_ERROR
		})
		next()
	} catch (error) {
		next(error)
	}
}