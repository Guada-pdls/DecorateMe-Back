import MainRouter from "./Router.js";
import passportCall from "../middlewares/passportCall.js";
import passwordValidator from "../middlewares/passwordValidator.js";
import registerValidator from "../middlewares/registerValidator.js";
import createHash from "../middlewares/createHash.js";
import UserController from "../controllers/UserController.js";
import passport from "passport";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import generateToken from "../middlewares/generateToken.js";
import validateResetPswToken from "../middlewares/validateResetPswToken.js";
import uploader from "../utils/uploader.js";
import config from "../config/config.js";

const { register, login, logout, current, sendPswMail, resetPassword, pswResetTokenCookie } = UserController;

class SessionRouter extends MainRouter {
  init() {
    this.post("/login", ["PUBLIC"], isLoggedIn, passportCall('login'), generateToken, login);

    this.post(
      "/register",
      ["PUBLIC"],
      uploader.single('photo'),
      isLoggedIn,
      registerValidator,
      passwordValidator,
      createHash,
      passportCall("register"),
      register
    );
    
    this.delete("/logout", ["USER", "PREMIUM", "ADMIN"], passportCall("jwt"), logout);

    this.post('/forgot-password', ['PUBLIC'], sendPswMail)
    
    this.get('/reset-password', ['PUBLIC'], validateResetPswToken, pswResetTokenCookie)
    
    this.post('/reset-password', ['PUBLIC'], validateResetPswToken, passwordValidator, resetPassword)

    this.get(
      "/current",
      ["USER", "PREMIUM", "ADMIN"],
      passportCall("jwt"),
      current
    );

    this.get('/google', ['PUBLIC'],
    passport.authenticate('google', 
    { scope: ['email', 'profile'] })
    )

    this.get('/google/callback', ['PUBLIC'],
      passport.authenticate('google', {
        failureRedirect: config.FRONT_DOMAIN + '/login'
      }
    ), generateToken, (req, res) => {
      res.redirect(config.FRONT_DOMAIN + '/login/google')
    })
    
  }
}

export default new SessionRouter();
