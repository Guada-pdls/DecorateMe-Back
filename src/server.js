import { Server } from "socket.io";
import server from "./app.js";
import config from "./config/config.js";
import { logger } from "./utils/logger.js";
import { chatService } from "./service/index.js";

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
    socket.emit('allMessages', chatService.getMessages())
    socket.on('newMessage', async data => {
      const msg = await chatService.createMessage(data)
      io.emit('message', msg)
    })
  }
)


export default server;
