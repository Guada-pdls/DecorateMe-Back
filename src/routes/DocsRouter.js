import { __dirname } from "../utils/utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express'
import MainRouter from "./Router.js";

const swaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'DecorateMe documentation',
			description: 'Api para la decoración del hogar'
		}
	},
	apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJsDoc(swaggerOptions)


class DocsRouter extends MainRouter {
	init() {
		this.get('/', ['PUBLIC'], swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
		// ! cb.apply is not a function
	}
}

export default new DocsRouter();