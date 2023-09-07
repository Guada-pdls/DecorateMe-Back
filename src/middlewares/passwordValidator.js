import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";

const passwordValidator = (req, res, next) => {
  try {
    let { password } = req.body;
    
    if (
      !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    ) {
      CustomError.createError({
        name: 'Error validating password',
        cause: 'Invalid password',
        message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
        code: EErrors.VALIDATION_ERROR
      })
    }
  
    next()
  } catch (error) {
    next(error)
  }
};

export default passwordValidator;
