import EErrors from "../../utils/error/enum.js";
import { logger } from "../../utils/logger.js";

const errorHandler = (error, req, res, next) => {
  logger.error(`${error.message}: ${error.cause}`);
  switch (error.code) {
    case EErrors.INVALID_TYPE_ERROR:
      return res.status(400).json({ success: false, error: error.cause });

    case EErrors.NOT_FOUND_ERROR:
      return res.status(404).json({ success: false, error: error.cause });

    case EErrors.BAD_REQUEST_ERROR:
      return res.status(400).json({ success: false, error: error.cause });

    case EErrors.VALIDATION_ERROR:
      return res.status(400).json({ success: false, error: error.cause });

    case EErrors.DATABASE_ERROR:
      return res.status(500).json({ success: false, error: error.cause });

    default:
      return res.status(500).json({ success: false, error: error.cause });
  }
};

export default errorHandler;
