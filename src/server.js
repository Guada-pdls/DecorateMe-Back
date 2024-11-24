import { Server } from "socket.io";
import app from "./app.js";
import config from "./config/config.js";
import { logger } from "./utils/logger.js";
import chat from "./utils/chat.js";
import http from "http";

const httpServer = http.createServer(app);

httpServer.listen(config.PORT, () => {
  logger.info("Server listening on port " + config.PORT);
});

const io = new Server(httpServer, {
  cors: {
    origin: config.FRONT_DOMAIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  logger.info(`client ${socket.client.id} connected`);
  chat(socket, io);
});
