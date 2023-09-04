// import server from "./app.js";
// import { Server } from "socket.io";
// import chatManager from "./dao/managers/Chat.js";

// // SOCKET

// let socket_server = new Server(http_server);
// const chats = chatManager.getChats();

// socket_server.on("connection", (socket) => {
//   // //  console.log(`client ${socket.client.id} connected`)

//   // Chat

//   socket.on("auth", () => {
//     socket_server.emit("all_messages", chats); // Envía los mensajes cuando se autentique
//   });

//   socket.on("new_message", (data) => {
//     chatManager.addMessage(data);
//     socket_server.emit("all_messages", chats);
//   });

//   // Carrito

//   socket.emit("quantity", quantity);
// });
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
import { addLogger, logger } from "./utils/logger.js";
import session from "express-session";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express'

const server = express();
config.connectDB();
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

server.use(cookieParser());
server.use("/public", express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

inicializePassport();
server.use(passport.initialize());

server.use(session({
  secret: config.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

server.use(addLogger)

server.use('/', router)

const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'DecorateMe documentation',
          description: 'Api para la decoración del hogar'
      }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJsDoc(swaggerOptions)
server.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

server.use(errorHandler)
server.use(notFoundHandler)

export const httpServer = () => server.listen(config.PORT, error => {
  if (error) logger.error(error.message)
  logger.info("Server listening on port " + config.PORT)
});

export default server;
