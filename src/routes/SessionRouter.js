import MainRouter from "./Router.js";
import passportCall from "../middlewares/passportCall.js";
import authJwt from "../passport-jwt/authJwt.js";
import password_validator from "../middlewares/passwordValidator.js";
import registerValidator from "../middlewares/registerValidator.js";
import createHash from "../middlewares/createHash.js";
import UserController from "../controllers/UserController.js";
import passport from "passport";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import generateToken from "../middlewares/generateToken.js";

const { register, login, logout, current } = UserController;

class SessionRouter extends MainRouter {
  init() {
    this.post("/login", ["PUBLIC"], isLoggedIn, passportCall('login'), generateToken, login);

    this.post(
      "/register",
      ["PUBLIC"],
      isLoggedIn,
      registerValidator,
      password_validator,
      createHash,
      passportCall("register"),
      register
    );

    this.get("/logout", ["USER", "ADMIN"], passportCall("jwt"), logout);

    this.get(
      "/current",
      ["USER", "ADMIN"],
      passportCall("jwt"),
      authJwt("user"),
      current
    );

    this.get('/google', ['PUBLIC'],
    passport.authenticate('google', 
    { scope: ['email', 'profile'] })
    )

    this.get('/google/callback', ['PUBLIC'],
      passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login'
      }
    ), generateToken, (req, res) => {
      return res.redirect('http://localhost:5173/')
    })
    
  }
}

export default new SessionRouter();
