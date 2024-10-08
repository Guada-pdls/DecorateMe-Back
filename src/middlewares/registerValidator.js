import { userService } from "../service/index.js";
import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";

const validator = async (req, res, next) => {
  try {
    let { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      CustomError.createError({
        name: 'Error creating user',
        cause: 'missing required fields',
        message: 'All data required',
        code: EErrors.VALIDATION_ERROR
      })
    } else if (!email.match(/^[^\s@]+@[^\s@]+.[^\s@]+$/)) {
      CustomError.createError({
        name: 'Error creating user',
        cause: 'The email must be valid',
        message: 'Invalid email',
        code: EErrors.VALIDATION_ERROR
      })
    }

    let userExists = await userService.getUserByEmail(email);
    if (Boolean(userExists)) {
      CustomError.createError({
        name: 'Error creating user',
        cause: 'user already registered',
        message: 'Cannot create',
        code: EErrors.VALIDATION_ERROR
      })
    }

    next()
  } catch (error) {
    next(error)
  }
};

export default validator;
