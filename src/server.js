import { Server } from "socket.io";
import app from "./app.js";
import config from "./config/config.js";
import { logger } from "./utils/logger.js";
import chat from "./utils/chat.js";
import cluster from "node:cluster"
import { cpus } from "node:os"
import http from "http"

if (cluster.isPrimary) {
  const processors = cpus().length;

  for (let i = 0; i < processors; i++) {
    cluster.fork();
  }

  cluster.on('message', (worker, code, signal) => {
    logger.error(`Message received from worker ${worker.process.pid}`);
  });
} else {
  const httpServer = http.createServer(app);

  httpServer.listen(config.PORT, () => {
    logger.info("Server listening on port " + config.PORT);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`client ${socket.client.id} connected`);
    chat(socket, io);
  });
}
