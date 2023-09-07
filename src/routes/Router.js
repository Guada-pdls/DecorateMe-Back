import { Router } from "express";
import { verify } from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import config from "../config/config.js";

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
      return res
        .status(401)
        .send({ status: "error", error: "Unauthenticated" });
    }
    let user = verify(req.cookies.token, config.SECRET_JWT);
    if (!policies.includes(user.role?.toUpperCase())) {
      return res.status(403).send({ status: "error", error: "Unauthorized" });
    }
    req.user = user;
    next();
  };

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
