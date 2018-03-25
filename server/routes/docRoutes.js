import express from 'express';

import Auth from '../controllers/auth';
import DocumentController from '../controllers/documents';

const docRoutes = express.Router();

docRoutes.route('/')
  .delete(Auth.validUser, DocumentController.discard)
  .get(Auth.validUser, DocumentController.list)
  .post(Auth.validUser, DocumentController.create);

docRoutes.route('/:role').get(Auth.adminUser, DocumentController.access);
docRoutes.route('/:id').put(Auth.validUser, DocumentController.update);

export default docRoutes;
