import express from "express";
import "dotenv/config.js";
import errorHandler from "./middlewares/error/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import { __dirname } from "./utils/utils.js";
import router from "./routes/index.js";
import cors from "cors";
import passport from "passport";
import inicializePassport from "./passport-jwt/passport.config.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { addLogger } from "./utils/logger.js";
import session from "express-session";
const MongoStore = require('connect-mongo')(session);
import compression from "express-compression";

const server = express();
config.connectDB();
server.use(
  cors({
    origin: config.FRONT_DOMAIN,
    credentials: true,
  })
);

server.use(cookieParser());
server.use("/public", express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(compression({
  brotli: {
    enabled: true,
    zlib: {}
  }
}))

inicializePassport();
server.use(passport.initialize());

server.use(session({
  secret: config.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: new MongoStore({
    checkPeriod: 86400000
  })
}));

server.use(addLogger)

server.use('/', router)

server.use(notFoundHandler)
server.use(errorHandler)

export default server