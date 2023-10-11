import { Router } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import config from "../config/config.js";
import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";

class MainRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => async (...params) => {
      try {
        await cb.apply(this, params);
      } catch (error) {
        logger.error(error.message);
        params[1].status(500).json(error);
      }
    });
  }

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (code = 200, response) =>
      res.status(code).json({ success: true, response });
    res.sendServerError = (code = 500, error) =>
      res.status(code).json({ success: false, error });
    res.sendUserError = (code = 400, error) =>
      res.status(code).json({ success: false, error });
    next();
  };

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();
    if (!req.cookies.token) {
      CustomError.createError({
        name: 'Policies error',
        cause: 'Unauthenticated',
        message: 'Access denied',
        code: EErrors.AUTH_ERROR
      })
    }
    let user = jwt.verify(req.cookies.token, config.SECRET_JWT);
    if (!user) {
      CustomError.createError({
        name: 'Token Error',
        cause: 'Invalid token',
        message: 'Access denied',
        code: EErrors.VALIDATION_ERROR
      })
    }
    const userRole = user.role.trim().toUpperCase()
    if (!policies.includes(userRole)) {
      CustomError.createError({
        name: 'Policies error',
        cause: 'Unauthorized',
        message: 'Access denied',
        code: EErrors.VALIDATION_ERROR
      })
    }
    req.user = user;
    next();
  };

  use(path, policies, ...callbacks) {
    this.router.use(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
}

export default MainRouter;
