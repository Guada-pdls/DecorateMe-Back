import MainRouter from "./Router.js";
import jwt from "jsonwebtoken";
import passportCall from '../middlewares/passportCall.js'
import User from "../dao/models/User.js";
import authJwt from "../passport-jwt/authJwt.js";
import password_validator from "../middlewares/passwordValidator.js";
import validator from "../middlewares/registerValidator.js";
import createhash from "../middlewares/createhash.js";
import { compareSync } from "bcrypt";

class SessionRouter extends MainRouter {
	init() {
		this.post('/login', ['PUBLIC'], async (req, res) => {
			try {
				if (req.cookies.token) {
					return res.sendUserError(401, 'You are already logged in')
				}
				let user = await User.findOne({ email: req.body.email })
				if (!user) { return res.sendUserError(404, 'User not registred') }

				const { password } = user
				let verified = compareSync(req.body.password, password)

				if (!verified) { return res.sendUserError(400, 'Invalid email or password')}

				let token = jwt.sign({ email: user.email, role: user.role }, process.env.SECRET_JWT)
				res.cookie('token', token, {
					maxAge: 60 * 60 * 24 * 7,
					httpOnly: true
				})
				res.sendSuccess(200, { user })
			} catch (error) {
				res.sendServerError(500, error)
			}
		})

		this.post('/register', ['PUBLIC'],validator, password_validator, createhash, passportCall('register'), (req, res) => {
			return res.sendSuccess('User registred successfully')
		})

		this.get('/logout', ['USER', 'ADMIN'], passportCall('jwt'), (req, res) => {
			try {
				return res.clearCookie('token').sendSuccess(200, 'User signed out')
			} catch (error) {
				res.sendServerError(error)
			}
		})
		this.get('/current', ['PUBLIC'], passportCall('jwt'), authJwt('user'), (req, res) => {
			res.sendSuccess(200, req.cookies.token)
		})
	}
}

export default new SessionRouter()