import MainRouter from './Router.js';
import UserController from '../controllers/UserController.js';
// import passportCall from '../middlewares/passportCall.js';

const { getUsers, getUser, getUserByEmail, updateUser, deleteUser, changeRole } =
  UserController;

class UserRouter extends MainRouter {
  init() {
    this.get('/', ['ADMIN'], getUsers);
    this.get('/:uid', ['ADMIN'], getUser);
    this.post('/', ['ADMIN'], getUserByEmail);
    this.put('/:uid', ['USER', 'ADMIN'], updateUser); // Poder cambiar contraseña -->
    this.put('/premium/:uid', ['ADMIN'], changeRole);
    this.delete('/:uid', ['ADMIN'], deleteUser); // y USER para borrar cuenta -->
  }
}

export default new UserRouter();
