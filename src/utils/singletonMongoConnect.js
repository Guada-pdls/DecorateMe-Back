import mongoose from "mongoose";
import { logger } from "./logger";

class MongoSingleton {
    static #instance
    constructor() {
        mongoose.connect(process.env.MONGO_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    static getInstance() {
        if (this.#instance) {
            logger.info('Already connected')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        logger.info('Connected DB')
        return this.#instance
    }
}

export default MongoSingleton