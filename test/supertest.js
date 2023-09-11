import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

const mockUser = {
	first_name: 'Guada',
	last_name: 'Example',
	email: 'guada@example.com',
	password: 'Hola123$'
}
const mockProduct = {
	name: 'Product 1',
  description: 'Product 1 description',
  price: 100,
  category: 'Wall Deco',
	thumbnail: 'http://example.com'
}
let cookie, userId, productId, cartId

describe('Testing DecorateMe', () => {
	describe('Test de session', () => {
		it('POST /api/session/register debe registrar un usuario correctamente', async () => {
			const { ok, statusCode, _body } = await requester.post('/api/session/register').send(mockUser)
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(201)
			expect(_body.success).to.be.true
		})
		it('POST /api/session/login debe loguear al usuario correctamente, generar un token y setear una cookie', async () => {
			const { ok, statusCode, _body, headers } = await requester.post('/api/session/login').send(mockUser)
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.user).to.have.property('_id')

			userId = _body.response.user._id.toString()

			// Seteo cookies y las verifico
			const cookieResult = headers['set-cookie'][0]
			cookie = {
				name: cookieResult.split('=')[0],
				value: cookieResult.split('=')[1]
			}
			expect(cookie.name).to.be.ok
			expect(cookie.value).to.be.ok
		})
		it('GET /api/session/current debe devolver un usuario', async () => {
			const { ok, statusCode, _body } = await requester.get('/api/session/current').set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.user).to.have.property('_id')
		})
		it('GET /api/session/logout debe deslogear al usuario', async () => {
			const { ok, statusCode, _body } = await requester.get('/api/session/logout').set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
		})
	})
	describe('Test de products', () => {
		before(async () => {
			// Accedo como admin para tener permisos
			const { headers } = await requester.post('/api/session/login').send({
				email: 'guadita@admin.com',
        password: 'Hola123$'
			})
      const cookieResult = headers['set-cookie'][0]
      cookie = {
        name: cookieResult.split('=')[0],
        value: cookieResult.split('=')[1]
      }
      expect(cookie.name).to.be.ok
      expect(cookie.value).to.be.ok
		})
		it('GET /api/products debe traer todos los productos', async () => {
			const { ok, statusCode, _body } = await requester.get('/api/products')
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.products.docs).to.be.an('array')
		})
		it('POST /api/products debe crear un producto correctamente', async () => {
			const { ok, statusCode, _body } = await requester.post('/api/products').send(mockProduct).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(201)
			expect(_body.success).to.be.true
			expect(_body.response.product).to.have.property('_id')
			productId = _body.response.product._id.toString()
		})
		it('GET /api/products/:pid debe traer un producto', async () => {
			const { ok, statusCode, _body } = await requester.get(`/api/products/${productId}`)
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.product).to.have.property('_id')
		})
		it('PUT /api/products/:pid debe actualizar un producto', async () => {
			const { ok, statusCode, _body } = await requester.put(`/api/products/${productId}`).send({...mockProduct, price: 99}).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.product.price).to.be.equal(99)
		})
		it('DELETE /api/products/:pid debe eliminar un producto', async () => {
			const { ok, statusCode, _body } = await requester.delete(`/api/products/${productId}`).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
		})
	})

	// * Elimino el usuario que creé a lo largo del test

	after(async function () {
		// Accedo como admin para tener permisos
		const log = await requester.post('/api/session/login').send({
			email: 'guadita@admin.com',
			password: 'Hola123$'
		})
		const cookieResult = log.headers['set-cookie'][0]
		cookie = {
			name: cookieResult.split('=')[0],
			value: cookieResult.split('=')[1]
		}
		expect(log.statusCode).to.be.equal(200)

		// Elimino el usuario
		const deletedUser = await requester.delete(`/api/users/${userId}`).set('cookie', [`${cookie.name}=${cookie.value}`])
		expect(deletedUser.statusCode).to.be.equal(200)
	})
})