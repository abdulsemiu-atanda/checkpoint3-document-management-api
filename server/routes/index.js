import Document from '../controllers/documents';
import Role from '../controllers/role';
import User from '../controllers/user';
import Auth from '../controllers/auth';

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Document Management API!',
  }));
  app.get('/api/role', Auth.adminUser, Role.list);
  app.get('/api/document', Auth.validUser, Document.list);
  app.get('/api/document/:role', Auth.adminUser, Document.access);
  app.get('/api/user/:id/document', Auth.validUser, Document.fetchUserDoc);
  app.get('/api/user', Auth.validUser, User.fetchDetails);
  app.get('/api/user/login', User.login);
  app.get('/api/user/logout', User.logout);

  app.post('/api/document', Auth.validUser, Document.create);
  app.post('/api/role', Auth.adminUser, Role.create);
  app.post('/api/user', User.create);

  app.put('/api/user', Auth.validUser, User.update);
  app.put('/api/document/:id', Auth.validUser, Document.update);

  app.delete('/api/user', Auth.adminUser, User.discard);
  app.delete('/api/document', Auth.validUser, Document.discard);
  app.delete('/api/role/:id', Auth.adminUser, Role.discard);
};
