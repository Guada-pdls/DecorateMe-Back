import MainRouter from './Router.js';
import UserController from '../controllers/UserController.js';
import uploader from '../utils/uploader.js';
// import passportCall from '../middlewares/passportCall.js';

const { getUsers, getUser, updateUser, deleteUser, uploadDocuments, changeRole } = UserController;

class UserRouter extends MainRouter {
  init() {
    this.get('/', ['ADMIN'], getUsers);
    this.get('/:uid', ['ADMIN'], getUser);
    this.put('/:uid', ['USER', 'ADMIN'], updateUser); // Poder cambiar contraseña -->
    this.post('/:uid/documents', ['USER', 'ADMIN'],  // TODO middleware para corroborar que el user sea el propietario de la cuenta
    uploader.fields([
      { name: 'identification', maxCount: 1 },
      { name: 'address proof', maxCount: 1 },
      { name: 'account statement proof', maxCount: 1 }
    ]), uploadDocuments); 
    this.put('/premium/:uid', ['USER', 'ADMIN'], changeRole);
    this.delete('/:uid', ['ADMIN'], deleteUser); // y USER para borrar cuenta -->
  }
}

export default new UserRouter();
