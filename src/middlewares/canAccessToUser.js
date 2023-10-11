import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";

export default async (req, res, next) => {
	try {
		if (req.user.role === 'admin') return next();

		const uid = req.params.uid
		
		if (uid !== req.user._id) {
			CustomError.createError({
				name: 'Access error',
				cause: 'Cannot access',
				message: 'You are not allowed to access this user',
				code: EErrors.VALIDATION_ERROR
			})
		}
		next()
	} catch (error) {
		next(error);
	}
}