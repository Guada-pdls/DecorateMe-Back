import EErrors from "../../utils/error/enum.js";
import { logger } from "../../utils/logger.js";

const errorHandler = (error, req, res, next) => {
  logger.error(`${error.cause}: ${error.message}`);
  switch (error.code) {
    case EErrors.INVALID_TYPE_ERROR:
      return res.status(400).json({ success: false, error: error.name });

    case EErrors.NOT_FOUND_ERROR:
      return res.status(404).json({ success: false, error: error.name });

    case EErrors.VALIDATION_ERROR:
      return res.status(400).json({ success: false, error: error.name });

    case EErrors.DATABASE_ERROR:
      return res.status(500).json({ success: false, error: error.name });

    default:
      return res.status(500).json({ success: false, error: error.message });
  }
};

export default errorHandler;
