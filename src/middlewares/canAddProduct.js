import { productService } from "../service/index.js";
import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";

export default async (req, res, next) => {
    try {
        const pid = req.params.pid
        const product = await productService.getProduct(pid)

        if (product.owner === req.user.email) CustomError.createError({
            name: 'Access error',
            cause: 'Cannot add product',
            message: 'You cannot add your own product',
            code: EErrors.VALIDATION_ERROR
        })

        next()
    } catch (error) { 
        next(error);
    }
}