import mongoose from "mongoose";

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
            console.log('Already connected')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('Connected DB')
        return this.#instance
    }
}

export default MongoSingleton