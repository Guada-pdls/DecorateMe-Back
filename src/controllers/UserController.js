import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import { cartService, userService } from "../service/index.js";
import { logger } from "../utils/logger.js";
import config from "../config/config.js";
import sendMail from "../utils/sendMail.js";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

class UserController {
  getUsers = async (req, res) => {
    try {
      let foundUsers = await userService.getUsers();
      let users = [];

      if (foundUsers) {
        foundUsers.forEach((user) => {
          users.push(new UserDTO(user));
        });
        return res.sendSuccess(200, { users });
      }
      return res.sendUserError(404, "Not found users");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  getUser = async (req, res) => {
    try {
      let id = req.params.uid;
      let user = await userService.getUser(id);

      user
        ? res.sendSuccess(200, { user: new UserDTO(user) })
        : res.sendUserError(404, "Not found user");
    } catch (error) {
      logger.error(error);
      logger.error(error);
      res.sendServerError(500, error);
    }
  };

  getUserByEmail = async (req, res) => {
    try {
      let email = req.body.email;
      let user = await userService.getUserByEmail(email);

      user
        ? res.sendSuccess(200, { user: new UserDTO(user) })
        : res.sendUserError(404, "Not found user");
    } catch (error) {
      logger.error(error);
      logger.error(error);
      res.sendServerError(500, error);
    }
  };

  updateUser = async (req, res) => {
    try {
      let id = req.params.uid;
      let foundUser = await userService.getUser(id);

      if (!foundUser) {
        return res.sendUserError(404, "Not found user");
      }

      let userData = req.body;
      if (
        // De momento que no se pueda cambiar ni el rol ni la contraseña
        Object.entries(userData).length !== 0
      ) {
        if (
          !("cid" in userData) &&
          !("role" in userData) &&
          !("password" in userData)
        ) {
          let user = await userService.updateUser(id, userData);
          return res.sendSuccess(200, { user: new UserDTO(user) });
        } else {
          return res.sendUserError(400, "There's data you can`t change");
        }
      }
      return res.sendUserError(400, "There's nothing to update");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  changeRole = async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await userService.getUser(uid) 

      if (!user) {
        return res.sendServerError(404, 'User not found')
      }

      const newRole = user.role.toUpperCase() === 'USER' ? 'premium' : 'user'

      await userService.updateUser(uid, { role: newRole })
      res.sendSuccess(200, 'User role updated to ' + newRole)
    } catch (error) {
      logger.error(error.message);
      return res.sendServerError(500, error.message);
    }
  }

  deleteUser = async (req, res) => {
    try {
      const uid = req.params.uid;
      let user = await userService.getUser(uid);
      const cid = user.cid;

      if (!user) {
        return res.sendUserError(404, "Not found user");
      }
      let deleteCart = await cartService.deleteCart(cid);
      let deleteUser = await userService.deleteUser(uid);

      if (deleteUser && deleteCart) {
        return res.sendSuccess(200, `User ${user._id} deleted`);
      }
    } catch (error) {
      logger.error(error.message);
      return res.sendServerError(500, error);
    }
  };

  login = (req, res) => res.sendSuccess(200, { user: req.user });

  register = (req, res) => res.sendSuccess(201, "User registred successfully");

  logout = async (req, res) => {
    try {
      return res.clearCookie("token").sendSuccess(200, "User signed out");
    } catch (error) {
      logger.error(error.message);
      return res.sendServerError(500, error);
    }
  };

  current = (req, res) => {
    return res.sendSuccess(200, { user: new UserDTO(req.user) });
  };

  pswResetTokenCookie(req, res) {
    res.cookie('resetPswToken', req.query.token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    })
    res.sendSuccess(201, 'Reset available')
  }

  sendPswMail = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.sendUserError(404, 'User not found')
      }
      const token = jwt.sign({ ...new UserDTO(user) }, config.SECRET_JWT, { expiresIn: '1h' })
      sendMail(email, 'Reset Password', `
        <h2>Reset account password</h2>
        <p>We received your change password request for your DecorateMe account, to modify your password <a href="http://localhost:5173/reset-password/?token=${token}">click here</a></p>
        <p>This link will expire in 1 hour, if you didn't request this password change, please disregard this.</p>
      `)
      res.sendSuccess(201, 'Mail sent successfully')
    } catch (error) {
      logger.error(error.message)
      res.sendServerError(500, error)
    }
  }

  resetPassword = async (req, res) => {
    try {
      const { password, confirmPassword } = req.body
      if (!password || !confirmPassword || !(password === confirmPassword)) return res.sendUserError(400, 'Passwords mismatch')

      const dbUser = await userService.getUserByEmail(req.user.email)
      if (compareSync(password, dbUser.password)) return res.sendUserError(400, 'The new password cannot be the same as the old one')

      const newPassword = hashSync(password, genSaltSync())
      await userService.updateUser(dbUser._id, { password: newPassword })

      return res.sendSuccess(200, 'Password updated successfully')
      // response & redirect
    } catch (error) {
      logger.error(error.message)
      res.sendServerError(500, error.message) // TODO error message
    }
  }


}

export default new UserController();
