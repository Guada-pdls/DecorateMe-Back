import MainRouter from "./Router.js";
import ProductController from "../controllers/ProductController.js";
import passportCall from "../middlewares/passportCall.js";
import canModifyProduct from "../middlewares/canModifyProduct.js";
import uploader from "../utils/uploader.js";

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } =
  ProductController;

class ProductsRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getProducts);
    this.post("/", ["PREMIUM", "ADMIN"], uploader.single('thumbnail'), passportCall('jwt'), createProduct);
    this.get("/:pid", ["PUBLIC"], getProduct);
    this.put("/:pid", ["PREMIUM", "ADMIN"], canModifyProduct, updateProduct);
    this.delete("/:pid", ["PREMIUM", "ADMIN"], passportCall('jwt'), canModifyProduct, deleteProduct);
  }
}

export default new ProductsRouter();
