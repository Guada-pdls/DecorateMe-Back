import { connect } from "mongoose";
import Users from "../src/dao/mongo/User.mongo.js";
import { strict as assert } from "assert"

connect('mongodb+srv://Guada:trvgXHbWIicI0CEH@coder-cluster.fbck2w0.mongodb.net/test')

let mockUser = {
	first_name: 'Guada',
	last_name: 'Test',
	email: 'guada@test.com',
	password: 'Test123$'
}

describe('Testing User Dao', () => {
	before(function () {
		this.usersDao = new Users()
	})
	beforeEach(function () {
		this.timeout(2000)
	})
	it('El dao debe leer todos los usuarios en formato array', async function () {
		const users = await this.usersDao.getUsers()
		assert.strictEqual(Array.isArray(users), true)
	})
	it('El dao debe crear un usuario correctamente', async function () {
		const user = await this.usersDao.createUser(mockUser)
		assert.ok(user._id)
	})
	it('El dao debe obtener un usuario a partir de su email', async function () {
		const user = await this.usersDao.getUserByEmail(mockUser.email)
		assert.strictEqual(typeof user, 'object')
		mockUser._id = user._id
	})
	it('El dao debe obtener un usuario a partir de su id', async function () {
		const user = await this.usersDao.getUser(mockUser._id)
		assert.strictEqual(typeof user, 'object')
	})
	it('El ususario creado debe contener por defecto role user', async function () {
		const user = await this.usersDao.getUser(mockUser._id)
		assert.strictEqual(user.role, 'user')
	})
	it('El ususario creado debe contener por defecto un array vacío de documents', async function () {
		const user = await this.usersDao.getUser(mockUser._id)
		assert.deepStrictEqual(user.documents, [])
	})
	it('El dao debe modificar correctamente alguna propiedad del usuario', async function () {
		const user = await this.usersDao.updateUser(mockUser._id, { first_name: 'Guadalupe' })
	  assert.strictEqual(user.first_name, 'Guadalupe')
	})
	it('El dao debe eliminar correctamente al usuario', async function () {
		const user = await this.usersDao.deleteUser(mockUser._id)
		assert.strictEqual(typeof user, 'object')
	})
})