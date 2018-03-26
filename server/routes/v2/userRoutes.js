import express from 'express';

import Auth from '../../controllers/auth';
import UserController from '../../controllers/user';

const userRoutes = express.Router();

userRoutes.route('/')
  .get(Auth.validUser, UserController.fetchDetails)
  .put(Auth.validUser, UserController.update);

export default userRoutes;
