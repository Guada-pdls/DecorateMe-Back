import { Schema, model } from "mongoose"

let collection = 'messages'

let schema = new Schema({
    from: { type: String, ref: "users"},
    message: { type: String, required: true }
})

let Message = model(collection, schema)

export default Message