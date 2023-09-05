import { productService } from "../service/index.js";
import CustomError from "../utils/error/CustomError.js";
import {
  productCreationErrorInfo,
  nonExistentProductErrorInfo,
  notFoundProductsErrorInfo,
} from "../utils/error/generateProductInfo.js";
import EError from "../utils/error/enum.js";

class ProductController {
  getProducts = async (req, res, next) => {
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

      CustomError.createError({
        name: 'Get products error',
        cause: notFoundProductsErrorInfo,
        message: 'Error getting products',
        code: EError.NOT_FOUND_ERROR
      })
    } catch (error) {
      next(error)
    }
  };

  getProduct = async (req, res, next) => {
    try {
      let id = req.params.pid
      let product = await productService.getProduct(id)
      if (product) {
        return res.sendSuccess(200, { product })
      } else {
        CustomError.createError({
          name: 'Get product error',
          cause: nonExistentProductErrorInfo(id),
          message: 'Error getting product',
          code: EError.NOT_FOUND_ERROR
        })
      }
    } catch (error) {
      next(error)
    }
  };

  createProduct = async (req, res, next) => {
    try {
      let { name, description, category, price, thumbnail, stock, rating } =
        req.body;
      if (!name || !description || !category || !price || !thumbnail) {
        CustomError.createError({
          name: "Product creation error",
          cause: productCreationErrorInfo(product),
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
        owner: req.user.email
      });
      return res.sendSuccess(201, {
        response: newProduct,
      });
    } catch (error) {
      next(error)
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
            code: EError.NOT_FOUND_ERROR,
          });
        }
      } else {
        response = "There's nothing to update";
      }
      return res.sendSuccess(200, response);
    } catch (error) {
      next(error)
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      let id = req.params.pid;
      let product = await productService.deleteProduct(id);
      if (product) {
        return res.sendSuccess(200, `Product '${product._id}' deleted`);
      } else {
        CustomError.createError({
          name: "Product deletion error",
          cause: nonExistentProductErrorInfo(id),
          message: "Error trying to delete the product",
          code: EError.NOT_FOUND_ERROR,
        });
      }
    } catch (error) {
      next(error)
    }
  };
}

export default new ProductController();
