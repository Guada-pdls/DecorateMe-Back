import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import UserDTO from '../dto/User.dto.js'

export default async (req, res, next) => {
	const token = jwt.sign(
		{ ...new UserDTO(req.user) },
		config.SECRET_JWT
	)
	await res.cookie('token', token, {
		maxAge: 60 * 60 * 24 * 7,
		httpOnly: true
	})
	return next()
}
