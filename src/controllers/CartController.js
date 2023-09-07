import { logger } from "../utils/logger.js";
import CustomError from "../utils/error/CustomError.js";
import EErrors from "../utils/error/enum.js";
import { nonExistentProductErrorInfo } from "../utils/error/generateProductInfo.js";
import { notFoundCarts, invalidUnits, nonExistentCart, nonExistentProductInCart, emptyCart, invalidStocks } from "../utils/error/generateCartInfo.js"
import { cartService, productService } from "../service/index.js";
import mongoose from "mongoose";

class CartController {
  getCarts = async (req, res, next) => {
    try {
      let carts = await cartService.getCarts([
        {
          $lookup: {
            from: "products",
            localField: "products.pid",
            foreignField: "_id",
            as: "productsPopulated",
          },
        },
        {
          $unwind: {
            path: "$productsPopulated",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { "productsPopulated.name": 1 } },
        {
          $group: {
            _id: "$_id",
            products: {
              $push: {
                pid: "$productsPopulated._id",
                units: {
                  $arrayElemAt: [
                    "$products.units",
                    {
                      $indexOfArray: [
                        "$products.pid",
                        "$productsPopulated._id",
                      ],
                    },
                  ],
                },
                name: "$productsPopulated.name",
                description: "$productsPopulated.description",
                category: "$productsPopulated.category",
                price: "$productsPopulated.price",
                thumbnail: "$productsPopulated.thumbnail",
                stock: "$productsPopulated.stock",
              },
            },
          },
        },
      ]);

      if (carts.length > 0) {
        return res.sendSuccess(200, carts);
      }

      CustomError.createError({
        name: "Get carts error",
        cause: notFoundCarts,
        message: "Error getting carts",
        code: EErrors.NOT_FOUND_ERROR
      })

    } catch (error) {
      newt(error)
    }
  }

  getCartBill = async (req, res, next) => {
    try {
      const id = req.params.cid;
      const cart = await cartService.getCartBill([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "products",
            localField: "products.pid",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $addFields: {
            totalProd: { $multiply: ["$products.units", "$product.price"] },
          },
        },
        {
          $group: {
            _id: "$_id",
            products: { $push: { $mergeObjects: ["$products", "$product", { totalProd: "$totalProd" }] } },
            totalCart: { $sum: "$totalProd" },
          },
        },
        {
          $project: {
            "products._id": 0,
            "products.rating": 0,
            "products.owner": 0,
            "products.__v": 0,
          },
        },
      ]);

      if (!cart) CustomError.createError({
        name: "Get cart error",
        cause: nonExistentCart(id),
        message: "Error getting cart",
        code: EErrors.NOT_FOUND_ERROR
      })

      return res.sendSuccess(200, cart[0]);
    } catch (error) {
      next(error)
    }
  };


  addProduct = async (req, res, next) => {
    try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let units = Number(req.params.units) || 1;

      units <= 0 && CustomError.createError({
        name: 'Invalid units',
        cause: invalidUnits,
        message: 'Error trying to add products to cart',
        code: EErrors.INVALID_TYPE_ERROR
      })

      let cartFound = await cartService.getCart(cartId);
      let productFound = await productService.getProduct(productId);

      if (!productFound) {
        CustomError.createError({
          name: `Get product error`,
          cause: nonExistentProductErrorInfo(productId),
          message: "Error trying to add products to cart",
          code: EErrors.NOT_FOUND_ERROR,
        });
      }

      if (!cartFound) {
        CustomError.createError({
          name: `Get cart error`,
          cause: nonExistentCart(cartId),
          message: "Error trying to add products to cart",
          code: EErrors.NOT_FOUND_ERROR,
        })
      }

      /* Check if the stock of a product is greater than or equal to the units to be added to the cart 
      and subtracted to the product stock. */
      units = productFound.stock < units ? productFound.stock : units;

      if (units === 0) res.sendSuccess(200, cartFound);

      if (cartFound.products.length !== 0) {
        /* Check if a product with the given `productId` already exists in 
        `cartFound.products` */
        let productInCart = cartFound.products.find(
          (product) => String(product.pid) === productId
        );
        if (productInCart) {
          /* Increases units of a existing product. */
          productFound.stock > productInCart.units + units
            ? (productInCart.units += units)
            : (productInCart.units = productFound.stock);
        } else {
          /* Add a product. */
          cartFound.products.push({ pid: productId, units });
        }
      } else {
        cartFound.products.push({ pid: productId, units });
      }

      let cart = await cartService.addProduct(cartId, {
        products: cartFound.products,
      });

      return res.sendSuccess(200, cart);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let units = Number(req.params.units) || 1;

      let cartFound = await cartService.getCart(cartId);
      let productFound = await productService.getProduct(productId);

      if (!productFound) {
        CustomError.createError({
          name: `Get product error`,
          cause: nonExistentProductErrorInfo(productId),
          message: "Error trying to add products to cart",
          code: EErrors.NOT_FOUND_ERROR
        });
      }

      if (!cartFound) {
        CustomError.createError({
          name: `Get cart error`,
          cause: nonExistentCart(cartId),
          message: "Error trying to add products to cart",
          code: EErrors.NOT_FOUND_ERROR
        })
      }

      let productInCart = cartFound.products.find(
        (product) => String(product.pid) === productId
      );

      if (!productInCart) {
        CustomError.createError({
          name: "Not found product in cart",
          cause: nonExistentProductInCart(productId),
          message: "Error trying to add products to cart",
          code: EErrors.NOT_FOUND_ERROR
        })
      }

      /* Check if the stock of a product is greater than or equal to the units to be added to the cart and subtracted to the product stock. */
      productInCart.units > units
        ? (productInCart.units -= units)
        : (cartFound = {
          ...cartFound,
          products: cartFound.products.filter(
            (product) => String(product.pid) !== productId
          ),
        });

      let cart = await cartService.deleteProduct(cartId, {
        products: cartFound.products,
      });

      return res.sendSuccess(200, cart);
    } catch (error) {
      next(error)
    }
  };

  clearCart = async (req, res) => {
    try {
      let cartId = req.params.cid;
      let cartFound = await cartService.getCart(cartId);

      if (!cartFound) CustomError.createError({
        name: `Get cart error`,
        cause: nonExistentCart(cartId),
        message: "Error trying to clear cart",
        code: EErrors.NOT_FOUND_ERROR
      })

      let cart = await cartService.clearCart(cartId, { products: [] });

      return res.sendSuccess(200, cart);
    } catch (error) {
      next(error)
    }
  };

  purchase = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getCart(cartId);

      if (!cart) {
        CustomError.createError({
          name: `Get cart error`,
          cause: nonExistentCart(cartId),
          message: "Error trying to purchase cart",
          code: EErrors.NOT_FOUND_ERROR
        })
      }

      if (cart.products.length === 0) {
        CustomError.createError({
          name: "Purchase error",
          cause: emptyCart,
          message: "Error trying to purchase cart",
          code: EErrors.BAD_REQUEST_ERROR
        })
      }

      let outOfStockProducts = [];
      let availableProducts = [];
      let amount = 0;

      for (const cartProduct of cart.products) {
        const product = await productService.getProduct(cartProduct.pid);
        const { _id, name, category, price } = product;

        if (cartProduct.units > product.stock) {
          outOfStockProducts.push({
            _id,
            name,
            category,
            price,
            stock: product.stock, // Mandamos el stock disponible
          });
        } else {
          availableProducts.push({
            _id,
            name,
            category,
            price,
            units: cartProduct.units, // Mandamos las unidades que pudo comprar
          });
          amount += product.price * cartProduct.units;

          product.stock -= cartProduct.units;
          await product.save();

          cart.products = cart.products.filter(
            (product) => product.pid !== cartProduct.pid
          );
          await cart.save();
        }
      }

      if (amount === 0) {
        CustomError.createError({
          name: "Purchase error",
          cause: invalidStocks,
          message: "Error trying to purchase cart",
          code: EErrors.BAD_REQUEST_ERROR
        })
      }

      const date = new Date().toLocaleString()

      const ticket = await cartService.purchase({
        purchase_date: date,
        amount,
        purchaser: req.user.email,
      });

      return res.sendSuccess(201, {
        ticket,
        purchasedItems: availableProducts,
        outOfStockProducts,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new CartController();

