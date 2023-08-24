import { logger } from "../utils/logger.js";

const not_found_handler = (req, res, next) => {
  logger.info(`not found ${req.method} ${req.url}`);
  return res.status(404).json({
    method: req.method,
    path: req.url,
    response: "not found",
  });
};

export default not_found_handler;
