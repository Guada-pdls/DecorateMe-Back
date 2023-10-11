import { faker } from '@faker-js/faker'

const generateUser = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		photo: faker.image.avatar(),
		email: faker.internet.email(),
		age: faker.helpers.rangeToNumber({min: 14, max: 99}),
		role: 'user',
		password: 'Test123$',
		cid: faker.database.mongodbObjectId(),
		documents: []
	}
}

export default generateUser