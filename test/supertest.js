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
		it('POST /api/session/register debe registrar un usuario con foto correctamente', async () => {
			const { ok, statusCode, _body } = await requester.post('/api/session/register')
				.field('first_name', mockUser.first_name)
				.field('last_name', mockUser.last_name)
				.field('email', mockUser.email)
				.field('password', mockUser.password)
				.attach('photo', './test/profile.jpg')
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(201)
			expect(_body.success).to.be.true
			expect(_body.response.user.photo)
		})
		it('POST /api/session/login debe loguear al usuario correctamente, generar un token y setear una cookie', async () => {
			const { ok, statusCode, _body, headers } = await requester.post('/api/session/login').send(mockUser)
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.user).to.have.property('_id')

			userId = _body.response.user._id.toString()
			cartId = _body.response.user.cid.toString()

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
	describe('Test de users', () => {
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
		it('GET /api/users debe traer todos los usuarios', async () => {
			const { ok, statusCode, _body } = await requester.get('/api/users').set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.users).to.be.an('array')
		})
		it('GET /api/users/:uid debe traer un usuario correctamente', async () => {
			const { ok, statusCode, _body } = await requester.get(`/api/users/${userId}`).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.user).to.be.an('object')
		})
		it('PUT /api/users/:uid debe modificar un usuario correctamente', async () => {
			const { ok, statusCode, _body } = await requester.put(`/api/users/${userId}`).send({ last_name: 'Changed' }).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.user.last_name).to.be.equal('Changed')
		})
		it('POST /api/users/:uid/documents debe postear varios documentos correctamente', async () => {
			const { ok, statusCode, _body } = await requester.post(`/api/users/${userId}/documents`)
			.attach('identification', './test/profile.jpg')
			.attach('address proof', './test/Sistema+de+archivos.pdf')
			.attach('account statement proof', './test/Sistema+de+archivos.pdf')
			.set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.length).to.equal(3)
		})
		it('PUT /api/users/premium/:uid debe actualizar a premium el role del user', async () => {
			const { ok, statusCode, _body } = await requester.put(`/api/users/premium/${userId}`).set('cookie', [`${cookie.name}=${cookie.value}`])
			console.log(_body)
			expect(ok).to.be.true
			expect(statusCode).to.equal(200)
			expect(_body.success).to.be.true
		})
	})
	describe('Test de products', () => {
		it('GET /api/products debe traer todos los productos', async () => {
			const { ok, statusCode, _body } = await requester.get('/api/products')
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.products.docs).to.be.an('array')
		})
		it('POST /api/products debe crear un producto correctamente', async () => {
			const { ok, statusCode, _body } = await requester.post('/api/products')
			.field('name', mockProduct.name)
			.field('description', mockProduct.description)
			.field('price', mockProduct.price)
			.field('category', mockProduct.category)
			.attach('thumbnail', './test/profile.jpg')
			.set('cookie', [`${cookie.name}=${cookie.value}`])
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
	describe('Test de carts', () => {
		before(async () => {
			// Accedo como user
			const { headers } = await requester.post('/api/session/login').send(mockUser)
      const cookieResult = headers['set-cookie'][0]
      cookie = {
        name: cookieResult.split('=')[0],
        value: cookieResult.split('=')[1]
      }
      expect(cookie.name).to.be.ok
      expect(cookie.value).to.be.ok
		})
		it('GET /api/cart/:cid debe traer el carrito del usuario', async () => {
			const { ok, statusCode, _body } = await requester.get(`/api/cart/${cartId}`).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response).to.have.property('_id')
		})
		it('PUT /api/cart/:cid/product/:pid/:units debe agregar units de pid a cid', async () => {
			productId = '64ebb295ced3b9fa1f0e26fd'
			const { ok, statusCode, _body } = await requester.put(`/api/cart/${cartId}/product/${productId}/2`).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response).to.have.property('_id')
			expect(_body.response.products[0]).to.be.an('object')
		})
		it('DELETE /api/cart/:cid/product/:pid/:units debe eliminar correctamente el producto del carrito', async () => {
			const { ok, statusCode, _body } = await requester.delete(`/api/cart/${cartId}/product/${productId}/1`).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response).to.have.property('_id')
			expect(_body.response.products).to.be.an('array')
		})
		it('DELETE /api/cart/:cid debe vaciar el carrito', async () => {
			const { ok, statusCode, _body } = await requester.delete(`/api/cart/${cartId}`).set('cookie', [`${cookie.name}=${cookie.value}`])
			expect(ok).to.be.true
			expect(statusCode).to.be.equal(200)
			expect(_body.success).to.be.true
			expect(_body.response.products).to.be.empty
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