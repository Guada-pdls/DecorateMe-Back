import MainRouter from './Router.js';
import UserController from '../controllers/UserController.js';
import uploader from '../utils/uploader.js';

const { getUsers, getUser, updateUser, deleteUser, uploadDocuments, changeRole, cleanUsers } = UserController;

class UserRouter extends MainRouter {
  init() {
    this.get('/', ['PUBLIC'], getUsers);
    this.get('/:uid', ['PUBLIC'], getUser);
    this.put('/:uid', ['USER', 'ADMIN'], updateUser); // Poder cambiar contraseña -->
    this.post('/:uid/documents', ['USER', 'ADMIN'],  // TODO middleware para corroborar que el user sea el propietario de la cuenta
    uploader.fields([
      { name: 'identification', maxCount: 1 },
      { name: 'address proof', maxCount: 1 },
      { name: 'account statement proof', maxCount: 1 }
    ]), uploadDocuments); 
    this.put('/premium/:uid', ['USER', 'ADMIN'], changeRole);
    this.delete('/:uid', ['ADMIN'], deleteUser); // y USER para borrar cuenta -->
    this.delete('/', ['ADMIN'], cleanUsers)
  }
}

export default new UserRouter();
