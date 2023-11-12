import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import { cartService, userService } from "../service/index.js";
import config from "../config/config.js";
import sendMail from "../utils/sendMail.js";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import CustomError from "../utils/error/CustomError.js";
import { nonAuthorizedFields, nonExistentUserByEmail, nonExistentUserById, notAuthorizedToBePremium, passwordsDoNotMatch, repeatedPassword } from "../utils/error/generateUserInfo.js";
import EErrors from "../utils/error/enum.js";
import deleteFile from "../utils/deleteFile.js";

class UserController {
  getUsers = async (req, res, next) => {
    try {
      let foundUsers = await userService.getUsers();
      let users = [];

      if (foundUsers) {
        foundUsers.forEach((user) => {
          users.push(new UserDTO(user));
        });
        return res.sendSuccess(200, { users });
      }
      CustomError.createError({
        name: "Get users error",
        cause: "Not found users, please try again later",
        message: "Error getting users",
        code: EErrors.NOT_FOUND_ERROR
      })
      return res.sendUserError(404, "Not found users");
    } catch (error) {
      next(error)
    }
  };

  getUser = async (req, res, next) => {
    try {
      let id = req.params.uid;
      let user = await userService.getUser(id);

      user
        ? res.sendSuccess(200, { user: new UserDTO(user) })
        : CustomError.createError({
          name: "Get user error",
          cause: nonExistentUserById(id),
          message: "Not found user",
          code: EErrors.NOT_FOUND_ERROR
        })
    } catch (error) {
      next(error)
    }
  };

  getUserByEmail = async (req, res, next) => {
    try {
      let email = req.body.email
      let user = await userService.getUserByEmail(email);

      user
        ? res.sendSuccess(200, { user: new UserDTO(user) })
        : CustomError.createError({
          name: "Get user error",
          cause: nonExistentUserByEmail(email),
          message: "Not found user",
          code: EErrors.NOT_FOUND_ERROR
        })
    } catch (error) {
      next(error)
    }
  };

  updateUser = async (req, res, next) => {
    try {
      let id = req.params.uid;
      let foundUser = await userService.getUser(id);

      if (!foundUser) {
        CustomError.createError({
          name: "Update user error",
          cause: nonExistentUserById(id),
          message: "Not found user",
          code: EErrors.NOT_FOUND_ERROR
        })
      }

      let userData = req.body;
      if (Object.entries(userData).length !== 0) {
        if (
          (!("cid" in userData) &&
            !("role" in userData) &&
            !("password" in userData)) || req.user.role === "admin"
        ) {
          let user = await userService.updateUser(id, userData);
          return res.sendSuccess(200, { user: new UserDTO(user) });
        } else {
          CustomError.createError({
            name: "Update user error",
            cause: nonAuthorizedFields,
            message: "Can't update user",
            code: EErrors.VALIDATION_ERROR
          })
        }
      }
      CustomError({
        name: "Update user error",
        cause: "There's nothing to update",
        message: "Error updating user",
        code: EErrors.VALIDATION_ERROR
      })
    } catch (error) {
      next(error)
    }
  };

  uploadDocuments = async (req, res, next) => {
    try {
      const uid = req.params.uid
      const user = await userService.getUser(uid)

      if (!user) {
        CustomError.createError({
          name: "Get user error",
          cause: nonExistentUserById(uid),
          message: "Not found user",
          code: EErrors.NOT_FOUND_ERROR
        })
      }

      if (req.files) {
        for (const document in req.files) {
          
          const sizeInMb = (parseInt(req.files[document][0].size) / 1024) / 1024
          if (sizeInMb > 5) CustomError.createError({
            name: 'Invalid size',
            cause: 'Cannot add document',
            message: 'The size of the file must be less than 5mb',
            code: EErrors.BAD_REQUEST_ERROR
          })

          const existingDocument = user.documents.find(doc => doc.name === document)
          if (existingDocument) CustomError.createError({
            name: 'Invalid document',
            cause: 'Cannot add a duplicated document',
            message: 'Document already exists',
            code: EErrors.BAD_REQUEST_ERROR
          })

          user.documents.push({
            name: document,
            reference: req.files[document][0].path
          })
        }
        user.save()
        res.sendSuccess(200, user.documents)
      } else {
        CustomError.createError({
          name: "Upload document error",
          cause: "Not found documents",
          message: "Error uploading documents",
          code: EErrors.NOT_FOUND_ERROR
        })
      }
    } catch (error) {
      next(error)
    }
  }

  changeRole = async (req, res, next) => {
    try {
      const uid = req.params.uid;
      const user = await userService.getUser(uid)

      if (!user) {
        CustomError.createError({
          name: 'Change role error',
          cause: nonExistentUserById(uid),
          message: 'Not found user',
          code: EErrors.NOT_FOUND_ERROR
        })
      }

      const newRole = user.role.toUpperCase() === "USER" ? "premium" : "user"

      if (newRole === "premium") {
        if (user.documents.length === 3) {
          await userService.updateUser(uid, { role: newRole })
        } else {
          CustomError.createError({
            name: 'Change role error',
            cause: notAuthorizedToBePremium(user.documents),
            message: 'Not allowed to update to premium',
            code: EErrors.VALIDATION_ERROR
          })
        }
      }
      res.sendSuccess(200, "User role updated to " + newRole)

    } catch (error) {
      next(error)
    }
  }

  deleteUser = async (req, res, next) => {
    try {
      const uid = req.params.uid;
      let user = await userService.getUser(uid);

      if (!user) {
        CustomError.createError({
          name: 'Get user error',
          cause: nonExistentUserById(uid),
          message: 'Not found user',
          code: EErrors.NOT_FOUND_ERROR
        })
      }
      const cid = user.cid

      let deletedCart = await cartService.deleteCart(cid);
      let deletedUser = await userService.deleteUser(uid);

      !user.photo?.endsWith('default.jpg') && deleteFile(user.photo)
      let deletedDocuments;
      if (user.documents) {
        user.documents.forEach(doc => deleteFile(doc.reference))
        deletedDocuments = true
      }

      if (deletedUser && deletedCart && deletedDocuments) {
        return res.sendSuccess(200, `User ${user._id} deleted`);
      }
    } catch (error) {
      next(error)
    }
  };

  login = (req, res) => res.sendSuccess(200, { user: req.user });

  register = (req, res) => res.sendSuccess(201, { user: new UserDTO(req.user) });

  logout = async (req, res) => {
    try {
      await userService.updateUser(req.user._id, { last_connection: Date.now() });
      return res.clearCookie("token").sendSuccess(200, "User signed out");
    } catch (error) {
      next(error)
    }
  };

  current = (req, res) => {
    return res.sendSuccess(200, { user: new UserDTO(req.user) });
  };

  pswResetTokenCookie(req, res) {
    res.cookie("resetPswToken", req.query.token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    })
    res.sendSuccess(201, "Reset available")
  }

  sendPswMail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user) {
        CustomError.createError({
          name: "Send email error",
          cause: nonExistentUserByEmail(email),
          message: "Error sending email",
          code: EErrors.BAD_REQUEST_ERROR
        })
      }
      const token = jwt.sign({ ...new UserDTO(user) }, config.SECRET_JWT, { expiresIn: "1h" })
      sendMail(email, "Reset Password", `
        <h2>Reset account password</h2>
        <p>We received your change password request for your DecorateMe account, to modify your password <a href="${config.FRONT_DOMAIN}/reset-password/?token=${token}">click here</a></p>
        <p>This link will expire in 1 hour, if you didn"t request this password change, please disregard this.</p>
      `)
      res.sendSuccess(201, "Mail sent successfully")
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req, res, next) => {
    try {
      const { password, confirmPassword } = req.body
      if (!password || !confirmPassword || !(password === confirmPassword))
        CustomError.createError({
          name: "Reset password error",
          cause: passwordsDoNotMatch,
          message: "Error resetting password",
          code: EErrors.VALIDATION_ERROR
        })

      const dbUser = await userService.getUserByEmail(req.user.email)
      if (compareSync(password, dbUser.password))
        CustomError.createError({
          name: "Reset password error",
          cause: repeatedPassword,
          message: "Error resetting password",
          code: EErrors.VALIDATION_ERROR
        })

      const newPassword = hashSync(password, genSaltSync())
      await userService.updateUser(dbUser._id, { password: newPassword })

      return res.sendSuccess(200, "Password updated successfully")
    } catch (error) {
      next(error)
    }
  }

  cleanUsers = async (req, res, next) => {
    try {
      const allUsers = await userService.getUsers()
      const deletedUsers = []
      const deadline = Date.now() - (60 * 60 * 60 * 24 * 2) // 2 days
      for (const user of allUsers) {
        if (user.last_connection < deadline || typeof user.last_connection === 'undefined') {
          await userService.deleteUser(user._id)
          sendMail(user.email, "Deleted user account", `
          <p>We have deleted your DecorateMe account due to inactivity.</p>
          `)
          deletedUsers.push(user)
        }
      }
      res.sendSuccess(200, { deletedUsers })
    } catch (error) {
      next(error)
    }
  }

}

export default new UserController();
