import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";

const validateCart = async (req, res, next) => {
  try {
    const requestedCart = req.params.cid;
  
    if (req.user.role.toUpperCase() !== "ADMIN") {
      const userCart = req.user?.cid?.toString();
      if (requestedCart !== userCart) {
        CustomError.createError({
          name: 'Validation Error',
          cause: 'Invalid cart',
          message: 'Carts do not match',
          code: EErrors.VALIDATION_ERROR
        })
      }
    }

    return next();
  } catch (error) {
    next(error)
  }
};

export default validateCart;
