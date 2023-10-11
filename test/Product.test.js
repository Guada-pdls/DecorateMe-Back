import { connect } from "mongoose";
import Products from "../src/dao/mongo/Product.mongo.js";
import { strict as assert } from 'assert'

connect('mongodb+srv://Guada:trvgXHbWIicI0CEH@coder-cluster.fbck2w0.mongodb.net/test')

let mockProduct = {
  name: 'Product',
	description: 'Test',
	category: 'Furniture',
	price: 22,
	stock: 22,
	thumbnail: 'http://test.com/'
}

describe('Testing Product Dao', () => {
	before(function () {
		this.productsDao = new Products()
	})
	beforeEach(function () {
		this.timeout(2000)
	})
	it('El dao debe leer todos los productos en formato array', async function () {
		const products = await this.productsDao.getProducts()
		assert.strictEqual(Array.isArray(products.docs), true)
	})
	it('El dao debe crear un producto correctamente', async function () {
		const product = await this.productsDao.createProduct(mockProduct)
		assert.ok(product._id)
		mockProduct._id = product._id
	})
	it('El dao debe traer un producto correctamente a partir de su id', async function () {
		const product = await this.productsDao.getProduct(mockProduct._id)
		assert.strictEqual(typeof product, 'object')
	})
	it('El dao debe modificar alguna propiedad del producto correctamente', async function () {
		const product = await this.productsDao.updateProduct(mockProduct._id, { description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit' })
		assert.strictEqual(product.description, 'Lorem, ipsum dolor sit amet consectetur adipisicing elit')
	})
	it('El dao debe eliminar el producto correctamente', async function () {
		const product = await this.productsDao.deleteProduct(mockProduct._id)
		assert.strictEqual(typeof product, 'object')
	})
})