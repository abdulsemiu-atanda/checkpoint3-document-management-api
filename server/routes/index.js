import DocumentController from '../controllers/documents';
import Role from '../controllers/role';
import User from '../controllers/user';

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Document Management API!',
  }));
  app.get('/api/role', Role.list);
  app.get('/api/document', DocumentController.list);
  app.get('/api/user', User.fetchDetails);
  app.get('/api/user/login', User.login);
  app.get('/api/user/logout', User.logout);

  app.post('/api/document', DocumentController.create);
  app.post('/api/role', Role.create);
  app.post('/api/user', User.create);

  app.put('/api/user', User.update);

  app.delete('/api/user', User.discard);
  app.delete('/api/document', DocumentController.discard);
};
