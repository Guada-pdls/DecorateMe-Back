import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";
import { logger } from "../utils/logger.js";

const notFoundHandler = (req, res, next) => {
  try {
    logger.info(`Not found ${req.method} ${req.url}`);
    CustomError.createError({
      name: 'Not found',
      cause: 'Invalid path',
      message: `Path ${req.url} not found`,
      code: EErrors.NOT_FOUND_ERROR
    })
  } catch (error) {
    next(error)
  }
};

export default notFoundHandler;
