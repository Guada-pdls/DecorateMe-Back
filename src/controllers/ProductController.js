import { productService } from "../service/index.js";
import CustomError from "../middlewares/error/CustomError.js";
import {
  productCreationErrorInfo,
  nonExistentProductErrorInfo,
} from "../middlewares/error/generateProductInfo.js";
import EError from "../middlewares/error/enum.js";

class ProductController {
  getProducts = async (req, res) => {
    try {
      let page = req.query.page ?? 1;
      let limit = req.query.limit ?? 6;
      let name = req.query.name
        ? new RegExp(req.query.name, "i")
        : new RegExp("");

      let products = await productService.getProducts(name, limit, page);

      if (products) {
        return res.sendSuccess(200, { products });
      }
      return res.sendUserError(404, { error: "Not found products" });
    } catch (error) {
      logger.error(error);
      res.sendServerError(error);
    }
  };

  getProduct = async (req, res) => {
    try {
      let id = req.params.pid;
      let product = await productService.getProduct(id);
      if (product) {
        return res.sendSuccess(200, { product });
      } else {
        return res.sendUserError(404, { error: "Not found" });
      }
    } catch (error) {
      logger.error(error);
      res.sendServerError(500, error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      let { name, description, category, price, thumbnail, stock, rating } =
        req.body;
      if (!name || !description || !category || !price || !thumbnail) {
        CustomError.createError({
          name: "Product creation error",
          cause: productCreationErrorInfo({
            name,
            description,
            category,
            price,
            thumbnail,
          }),
          message: "Error trying to create product",
          code: EError.INVALID_TYPE_ERROR,
        });
      }
      let newProduct = await productService.createProduct({
        name,
        description,
        category,
        price,
        thumbnail,
        stock,
        rating,
      });
      return res.sendSuccess(201, {
        response: newProduct,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      let id = req.params.pid;
      let productData = req.body;
      let response;
      if (Object.entries(productData).length !== 0) {
        let product = await productService.updateProduct(id, productData);
        if (product) {
          response = { product };
        } else {
          CustomError.createError({
            name: "Product update error",
            cause: nonExistentProductErrorInfo(id),
            message: "Error trying to update the product",
            code: EError.DATABASE_ERROR,
          });
        }
      } else {
        response = "There's nothing to update";
      }
      return res.sendSuccess(200, response);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      let id = req.params.pid;
      let product = await productService.deleteProduct(id);
      if (product) {
        return res.sendSuccess(200, `Product '${product._id}' deleted`);
      } else {
        // return res.sendUserError(404, "Product not found");
        CustomError.createError({
          name: "Product deletion error",
          cause: nonExistentProductErrorInfo(id),
          message: "Error trying to delete the product",
          code: EError.DATABASE_ERROR,
        });
      }
    } catch (error) {
      logger.error(error);
      next(error);
      // res.sendServerError(500, error);
    }
  };
}

export default new ProductController();
