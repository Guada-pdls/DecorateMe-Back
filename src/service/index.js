import { ProductDao, CartDao, UserDao, ChatDao } from "../dao/factory.js";
import ProductRepository from "../repositories/Product.repository.js";
import CartRepository from "../repositories/Cart.repository.js";
import UserRepository from "../repositories/User.repository.js";
import ChatRepository from "../repositories/Chat.repository.js";

const productService = new ProductRepository(new ProductDao());
const cartService = new CartRepository(new CartDao());
const userService = new UserRepository(new UserDao());
const chatService = new ChatRepository(new ChatDao());

export { productService, cartService, userService, chatService };
