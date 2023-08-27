import { productService } from "../service/index.js"

export default async (req, res, next) => {
	try {
		if (req.user.role === 'admin') return next()

		const pid = req.params.pid
		const product = await productService.getProduct(pid)

		if (!(product.owner === req.user.email)) return res.sendUserError(401, 'You must be the product owner or an admin to delete this')
		next()
	} catch (error) {
		logger.error(error.message)
		res.sendUserError(500, 'You are not allowed to modify this')
	}
}