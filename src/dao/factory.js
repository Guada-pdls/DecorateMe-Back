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
    const { default: ProductDaoMemory } = await import("./memory/Products.js")
    const { default: ChatDaoMemory } = await import("./memory/Chat.js")

    CartDao = CartDaoMemory;
    ProductDao = ProductDaoMemory;
    ChatDao = ChatDaoMemory;

    break;
}

export { ProductDao, CartDao, UserDao, ChatDao};
