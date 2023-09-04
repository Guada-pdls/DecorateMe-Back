import { compareSync } from "bcrypt";
import CustomError from "../utils/error/CustomError";
import EErrors from "../utils/error/enum";

export default (req, res, next) => {
  try {
    const formPassword = req.body.password;
    const dbPassword = req.user.password;

    let verified = compareSync(formPassword, dbPassword);
    if (verified) return next();

    CustomError.createError({
      name: 'Invalid request',
      cause: 'Invalid email or password',
      message: 'Check your email and password and try again',
      code: EErrors.BAD_REQUEST_ERROR
    })
  } catch (error) {
    next(error);
  }
};
