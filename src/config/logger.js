import winston from "winston";
import config from "./config.js";

const customLoggerOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "blue",
    debug: "magenta",
  },
  transports: {
    console: {},
  },
};

let logger;
if (config.MODE === "development") {
  logger = winston.createLogger({
    levels: customLoggerOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLoggerOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLoggerOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLoggerOptions.colors }),
          winston.format.simple()
        ),
      }),

      new winston.transports.File({
        filename: "errors.log",
        level: "error",
        format: winston.format.simple(),
      }),
    ],
  });
}

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(
    `${req.method} in ${req.url} - ${new Date().toLocaleString()}`
  );
  next();
};

export { logger, addLogger };

