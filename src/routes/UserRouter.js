import MainRouter from './Router.js';
import UserController from '../controllers/UserController.js';
import uploader from '../utils/uploader.js';
import canAccessToUser from '../middlewares/canAccessToUser.js';

const { getUsers, getUser, updateUser, deleteUser, uploadDocuments, changeRole, cleanUsers } = UserController;

class UserRouter extends MainRouter {
  init() {
    this.get('/', ['ADMIN'], getUsers);
    this.get('/:uid', ['USER', 'PREMIUM', 'ADMIN'], canAccessToUser, getUser);
    this.put('/:uid', ['USER', 'PREMIUM', 'ADMIN'], canAccessToUser, updateUser); 
    this.post('/:uid/documents', ['USER', 'ADMIN'], 
    uploader.fields([
      { name: 'identification', maxCount: 1 },
      { name: 'address proof', maxCount: 1 },
      { name: 'account statement proof', maxCount: 1 }
    ]), canAccessToUser, uploadDocuments); 
    this.put('/premium/:uid', ['USER', 'ADMIN'], canAccessToUser, changeRole);
    this.delete('/:uid', ['USER', 'PREMIUM', 'ADMIN'], canAccessToUser, deleteUser); 
    this.delete('/', ['ADMIN'], cleanUsers)
  }
}

export default new UserRouter();
