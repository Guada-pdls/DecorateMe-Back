import UserDTO from "../src/dto/User.dto.js";
import generateUser from "../src/utils/mocks/generateUser.js";
import { expect } from "chai";

describe('Testing de User DTO', () => {
	it('El servicio debe devolver un user con campos unificados', () => {
		let user = generateUser()
		let dtoUser = new UserDTO(user)
		expect(dtoUser).to.have.property('full_name')
		expect(dtoUser).to.not.have.property('first_name')
		expect(dtoUser).to.not.have.property('last_name')
		expect(dtoUser).to.not.have.property('password')
	})
})