import express from 'express';

import Auth from '../controllers/auth';
import RoleController from '../controllers/role';

const roleRoute = new express.Router();

roleRoute.route('/')
  .get(Auth.adminUser, RoleController.list)
  .post(Auth.adminUser, RoleController.create);

roleRoute.route('/:id')
  .delete(Auth.adminUser, RoleController.discard);

export default roleRoute;
