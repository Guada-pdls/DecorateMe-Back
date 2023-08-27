import { model, Schema, Types } from 'mongoose';

let collection = 'users';

let schema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  photo: {
    type: String,
    default:
      'https://images-ext-2.discordapp.net/external/BohSksq0ot1Y-lwrt8-wkD9fmyHbKwzWbSP27CG7XBU/https/cdn-icons-png.flaticon.com/512/1053/1053244.png?width=460&height=460',
  },
  email: { type: String, required: true, unique: true, index: true },
  age: { type: Number },
  role: {
    type: String,
    required: true,
    enum: ['user', 'premium', 'admin'],
    default: 'user',
  },
  password: { type: String, required: true },
  cid: { type: Types.ObjectId, ref: 'carts', unique: true },
});

let User = model(collection, schema);

export default User;
