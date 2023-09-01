import { logger } from "../utils/logger.js";
import CustomError from "../middlewares/error/CustomError.js";
import EErrors from "../middlewares/error/enum.js";
import { nonExistentProductErrorInfo } from "../middlewares/error/generateProductInfo.js";
import { cartService, productService } from "../service/index.js";
import { Types } from "mongoose";

class CartController {
  getCarts = async (req, res) => {
    try {
      let carts = await cartService.getCarts([
        {
          $lookup: {
            from: "products", // Colección
            localField: "products.pid", // Campo de la colección
            foreignField: "_id", // Campo de la colección que debo buscar
            as: "productsPopulated", // Nombre
          },
        },
        {
          $unwind: {
            path: "$productsPopulated",
            preserveNullAndEmptyArrays: true,
          },
        }, // Desagrega el arreglo del lookup, y agrega aquellos que están vacíos
        { $sort: { "productsPopulated.name": 1 } },
        {
          $group: {
            _id: "$_id",
            products: {
              $push: {
                pid: "$productsPopulated",
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
              },
            },
          },
        },
      ]);

      if (carts.length > 0) {
        return res.sendSuccess(200, carts);
      }

      return res.sendUserError(404, "Cart not found");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  getCart = async (req, res) => {
    try {
      let id = req.params.cid;
      let cart = await cartService.getCart(id);
      if (cart) {
        return res.sendSuccess(200, { cart });
      }
      return res.sendUserError(404, "Cart not found");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  getCartBill = async (req, res) => {
    try {
      let id = req.params.cid;
      let cart = await cartService.getCartBill([
        { $match: { _id: new Types.ObjectId(id) } }, // filtro por id carrito
        { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products.pid",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,
            total: {
              $multiply: ["$products.units", "$product.price"],
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]);
      if (cart) {
        return res.sendSuccess(200, cart);
      }
      return res.sendUserError(404, "Cart not found");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  addProduct = async (req, res, next) => {
    try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let units = Number(req.params.units) || 1;

      units <= 0 && CustomError.createError({
        name: 'Invalid units',
        cause: invalidUnits(),
        message
      })

      let cartFound = await cartService.getCart(cartId);
      let productFound = await productService.getProduct(productId);

      if (!productFound) {
        CustomError.createError({
          name: `Product search error`,
          cause: nonExistentProductErrorInfo(productId),
          message: "Error trying to add products to cart",
          code: EErrors.DATABASE_ERROR,
        });
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
      logger.error(error);
      // return res.sendServerError(500, error); // error: updating cart
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let units = Number(req.params.units) || 0;

      let cartFound = await cartService.getCart(cartId);
      let productFound = await productService.getProduct(productId);

      if (!productFound) {
        CustomError.createError({
          name: `Product search error`,
          cause: non_existentProductErrorInfo(productId),
          message: "Error trying to add products to cart",
          code: EErrors.DATABASE_ERROR,
        });
      }

      let productInCart = cartFound.products.find(
        (product) => String(product.pid) === productId
      );

      if (!productInCart) {
        return res.sendUserError(400, "Not found product in cart");
      }

      /* Check if the stock of a product is greater than or equal to the units to be added to the cart 
      and subtracted to the product stock. */
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
      logger.error(error);
      next(error);
    }
  };

  clearCart = async (req, res) => {
    try {
      let cartId = req.params.cid;
      let cartFound = await cartService.getCart(cartId);

      // if (!cartFound) res.sendUserError(404, "Cart not found");

      let cart = await cartService.clearCart(cartId, { products: [] });

      return res.sendSuccess(200, cart);
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  purchase = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getCart(cartId);

      // NO NECESITA ESTO POR QUE SE MANEJA CON LOS MIDDLEWARES (BORRAR CUANDO LO VEAS JEJE)
      // if (!cart) {
      //   return res.sendUserError(404, "Cart not found");
      // }

      if (cart.products.length === 0) {
        return res.sendUserError(400, "No products in cart");
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
        return res.sendUserError(400, {
          error: "The cart only has out-of-stock products.",
          outOfStockProducts,
        });
      }

      const date = new Date();
      const formattedDate = date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const ticket = await cartService.purchase({
        purchase_date: formattedDate,
        amount,
        purchaser: req.user.email,
      });

      return res.sendSuccess(201, {
        ticket,
        purchasedItems: availableProducts,
        outOfStockProducts,
      });
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };
}

export default new CartController();

