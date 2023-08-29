import passport from "passport";
import { Strategy } from "passport-local";
import passportJWT from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UserDTO from "../dto/User.dto.js";
import { cartService, userService } from "../service/index.js";
import config from "../config/config.js";
import { logger } from "../utils/logger.js";
import { compareSync } from "bcrypt";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = config;

let cookieExtractor = (req) => {
  let token = null;
  if (req?.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const configStrategy = {
  jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
  secretOrKey: config.SECRET_JWT,
};

const initializePassport = () => {
  // JWT AUTH

  passport.use(
    "jwt",
    new JWTStrategy(configStrategy, async (jwt_payload, done) => {
      try {
        let user = await userService.getUserByEmail(jwt_payload.email);
        if (user) {
          return done(null, { ...new UserDTO(user) });
        } else {
          return done(null, false, 'Not logged');
        }
      } catch (error) {
        logger.error(error.message);
        return done(error, false);
      }
    })
  );

  // LOGIN

  passport.use(
    "login",
    new Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          if (req.cookies.token) {
            return done('You are already logged in', false)
          }

          let user = await userService.getUserByEmail(username);
          if (!user) {
            return done(null, false, 'Invalid email or password');
          }

          const { password } = user
          let verified = compareSync(req.body.password, password)
          if (!verified) {
            return done(null, false, 'Invalid email or password');
          }

          req.user = new UserDTO(user)

          return done(null, { ...new UserDTO(user) });
        } catch (error) {
          logger.error(error.message);
          done(error, false);
        }
      }
    )
  );

  // REGISTER

  passport.use(
    "register",
    new Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          let user = await userService.getUserByEmail(username);
          if (!user) {
            let cart = await cartService.createCart();
            let user = await userService.createUser({
              ...req.body,
              cid: cart._id,
            });
            delete user.password;
            return done(null, user);
          }
          return done(null, false); // Redirecciona
        } catch (error) {
          logger.error(error);
          return done(error, false);
        }
      }
    )
  );

  // GOOGLE
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let one = await userService.getUserByEmail(profile.emails[0].value);
          if (one) {
            req.user = one;
            return done(null, one);
          }
          if (!one) {
            const cart = await cartService.createCart();
            let user = await userService.createUser({
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              password: profile.id,
              email: profile.emails[0].value,
              photo: profile.photos[0].value,
              cid: cart._id,
            });
            req.user = user;
            return done(null, user);
          }
        } catch (error) {
          logger.error(error.message);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default initializePassport;
