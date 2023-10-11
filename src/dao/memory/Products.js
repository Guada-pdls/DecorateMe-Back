import fs from 'fs'

export class ProductManager {
  constructor(path) {
    this.path = path
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, 'utf-8')
        return products ? JSON.parse(products) : "Not found"
      }
      return []
    } catch (error) {
      return 'getProducts: error'
    }
  }
  
  async createProduct(title, description, price, thumbnail, stock = 0) {

    try {
      let fileProducts = await this.getProducts() // Traigo los productos del archivo
      typeof fileProducts === 'string' && (fileProducts = [])
      // Genero el producto y lo pusheo a fileProducts

      const id = fileProducts.length === 0 ? 1 : fileProducts[fileProducts.length - 1].id + 1; // Si el lenght === 0, id = 1, de lo contrario tomo el id del último producto del array y le sumo 1
      let product = { id, title, description, price, thumbnail, stock }
      fileProducts.push(product)

      // Serializo el array y lo escribo en el archivo

      const data = JSON.stringify(fileProducts, null, 2)
      await fs.promises.writeFile(this.path, data)

      return `Product created successfully. ID: ${id}`
    } catch (error) {
      return 'addProduct: error'
    }
  }

  async getProduct(id) {
    try {
      const fileProducts = await this.getProducts()
      let productFound = fileProducts.find(prod => prod.id === id)
      return productFound !== undefined ? productFound : 'Product not found'
    } catch (error) {
      return 'getProducts: error'
    }
  }

  async deleteProduct(id) {
    try {
      if (typeof await this.getProduct(id) === 'object') {
        const fileProducts = await this.getProducts()
        const remainingProducts = fileProducts.filter(prod => prod.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(remainingProducts, null, 2))
        return 'Product deleted successfully'
      }
      return 'Product not found'
    } catch (error) {
      return 'deleteProduct: error'
    }
  }

  async updateProduct(id, data) {
    try {
      const product = await this.getProduct(id)
      if (typeof product === 'object') {
        const modifiedProduct = { ...product, ...data, id: id } // Creo un nuevo objeto con todas las propiedades del original y le agrego las de data. También reescribo el id para evitar que en data se pueda modificar.

        // Elimino el producto antiguo del archivo y agrego el modificado
        await this.deleteProduct(id)

        let fileProducts = await this.getProducts()
        fileProducts.push(modifiedProduct)
        const stringifyProducts = JSON.stringify(fileProducts, null, 2)
        await fs.promises.writeFile(this.path, stringifyProducts)

        return 'Product modified successfully'
      }
      return `No products found with ID ${id}`
    } catch (error) {
      return 'updateProduct: error'
    }
  }
}

export const store = new ProductManager('./src/data/products.json')
