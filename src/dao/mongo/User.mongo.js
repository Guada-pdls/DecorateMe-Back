import { __dirname } from "../../utils/utils.js";
import User from "./models/User.js";

class UserDao {
  constructor() {
    this.userModel = User;
  }

  getUsers = async () => {
    return await this.userModel.find();
  };

  getUser = async (id) => {
    return await this.userModel.findById(id);
  };

  getUserByEmail = async (email) => {
    return await this.userModel.findOne({ email: email });
  };

  createUser = async (userData) => {
    return await this.userModel.create(userData);
  };

  updateUser = async (id, updatedData) => {
    return await this.userModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
  };

  deleteUser = async (id) => {
    return await this.userModel.findByIdAndDelete(id);
  };
}

export default UserDao;
