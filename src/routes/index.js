import { Router } from "express";
import SessionRouter from "./SessionRouter.js";
import UserRouter from "./UserRouter.js";
import ProductsRouter from "./ProductsRouter.js";
import CartRouter from "./CartRouter.js";
import sendMail from "../utils/sendMail.js";
import MockingRouter from "./MockingRouter.js";

const router = Router();

router.use("/api/session", SessionRouter.getRouter());
router.use("/api/users", UserRouter.getRouter());
router.use("/api/products", ProductsRouter.getRouter());
router.use("/api/cart", CartRouter.getRouter());
router.use("/api/mocking", MockingRouter.getRouter());
router.use("/api/gmail", async (req, res) => {
  await sendMail('Test', 'hi');
  res.send("Email sended successfully");
});
// router.use('/api/logger', async (req, res) => {
//   req.logger.error('error - ' + Date().toLocaleString());
//   res.send('logger registred');
// })

// router.use('/api/logger', async (req, res) => {
//   req.logger.error('error - ' + Date().toLocaleString());
//   res.send('logger registred');
// })

export default router;
