import config from "../config/config.js";
let ProductDao, CartDao, UserDao, ChatDao;

switch (config.PERSISTENCE) {
  case "MONGO":
    const { default: ProductDaoMongo } = await import("./mongo/Product.mongo.js");
    const { default: CartDaoMongo } = await import("./mongo/Cart.mongo.js");
    const { default: UserDaoMongo } = await import("./mongo/User.mongo.js");
    const { default: ChatDaoMongo } = await import("./mongo/Chat.mongo.js");

    ProductDao = ProductDaoMongo;
    CartDao = CartDaoMongo;
    UserDao = UserDaoMongo;
    ChatDao = ChatDaoMongo;

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

export { ProductDao, CartDao, UserDao, ChatDao};
