import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import UserDTO from '../dto/User.dto.js'

export default (req, res, next) => {
	const token = jwt.sign(
		{ ...new UserDTO(req.user) },
		config.SECRET_JWT
	)
	res.cookie('token', token, {
		maxAge: 60 * 60 * 24 * 7,
		httpOnly: true
	})                    
	next()
}
