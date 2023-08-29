import { compareSync } from "bcrypt";

export default (req, res, next) => {
  try {
    const formPassword = req.body.password;
    const dbPassword = req.user.password;

    let verified = compareSync(formPassword, dbPassword);
    if (verified) return next();

    return res.status(401).json({
      success: false,
      error: "Invalid email or password",
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
