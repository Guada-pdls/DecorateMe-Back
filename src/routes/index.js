import { Router } from "express";
import SessionRouter from "./SessionRouter.js";
import UserRouter from "./UserRouter.js";
import ProductsRouter from "./ProductsRouter.js";
import CartRouter from "./CartRouter.js";
import MockingRouter from "./MockingRouter.js";
import docsRouter from "./docsRouter.js";

const router = Router();

router.use("/api/session", SessionRouter.getRouter())
router.use("/api/users", UserRouter.getRouter())
router.use("/api/products", ProductsRouter.getRouter())
router.use("/api/cart", CartRouter.getRouter())
router.use("/api/mocking", MockingRouter.getRouter())
router.use("/docs", docsRouter)

export default router;
