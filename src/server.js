import { Server } from "socket.io";
import server from "./app.js";
import config from "./config/config.js";
import { logger } from "./utils/logger.js";
import { chatService } from "./service/index.js";
import chat from "./utils/chat.js";

let httpServer = server.listen(config.PORT, error => {
  if (error) logger.error(error.message)
  logger.info("Server listening on port " + config.PORT)
});

let io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }
});

io.on(
  'connection',
  async socket => {
    logger.info(`client ${socket.client.id} connected`)
    chat(socket, io)
  }
)


export default server;
