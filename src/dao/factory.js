import config from "../config/config.js";
let ProductDao, CartDao, UserDao;

switch (config.PERSISTENCE) {
  case "MONGO":
    const { default: ProductDaoMongo } = await import("./mongo/Product.mongo.js");
    const { default: CartDaoMongo } = await import("./mongo/Cart.mongo.js");
    const { default: UserDaoMongo } = await import("./mongo/User.mongo.js");

    ProductDao = ProductDaoMongo;
    CartDao = CartDaoMongo;
    UserDao = UserDaoMongo;

    break;
  case "MEMORY":
    const { default: CartDaoMemory } = await import("./memory/Cart.js");

    CartDao = CartDaoMemory;

    break;

  case "FILE":
    break;
  default:
    break;
}

export { ProductDao, CartDao, UserDao };
