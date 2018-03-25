import express from 'express';

import Auth from '../controllers/auth';
import DocumentController from '../controllers/documents';
import UserController from '../controllers/user';

const userRoutes = express.Router();

userRoutes.route('/')
  .delete(Auth.adminUser, UserController.discard)
  .get(Auth.validUser, UserController.fetchDetails)
  .post(UserController.create)
  .put(Auth.validUser, UserController.update);

userRoutes.route('/:id/document').get(Auth.validUser, DocumentController.fetchUserDoc);
userRoutes.route('/login').post(UserController.login);
userRoutes.route('/logout').get(UserController.logout);

export default userRoutes;
