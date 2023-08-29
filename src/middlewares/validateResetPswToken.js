import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { logger } from "../utils/logger.js"

export default (req, res, next) => {
	try {
		let user
		let { token } = req.query
		if (!token) { // if the token doesn't exist in the params, look it up in cookies
			const { resetPswToken } = req.cookies
			if (!resetPswToken) return res.sendUserError(401, 'No token provided')
			user = jwt.verify(resetPswToken, config.SECRET_JWT)
		} else {
			user = jwt.verify(token, config.SECRET_JWT)
		}
	
		req.user = { email: user.email}
		next()
	} catch (error) {
		logger.error(error.message)
		res.sendUserError(498, 'Expired or invalid token')
	}
}
