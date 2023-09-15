import { model, Schema, Types } from 'mongoose';
import { __dirname } from '../../../utils/utils.js';

let collection = 'users';

let schema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  photo: {
    type: String,
    default:
      `${__dirname}/../public/img/default.jpg`,
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
  documents: {
    type: [{
      name: { type: String, required: true, enum: ['identification', 'adress proof', 'account statement proof'] },
      reference: { type: String, required: true }
    }],
    default: [],
  },
  last_connection: { type: String }
});

let User = model(collection, schema);

export default User;
