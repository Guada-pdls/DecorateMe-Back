import { __dirname } from "../utils/utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express'
import { Router } from "express";

const docsRouter = Router()

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

docsRouter.use('/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

export default docsRouter;