import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../../server/models';
import testdata from '../testdata';

const expect = chai.expect;
const fakeUser = testdata.fakeUser;
const fakeAdmin = testdata.fakeAdmin;
const wrongPassword = { username: fakeAdmin.username, password: 'julio' };
const adminCredentials = { username: fakeAdmin.username, password: fakeAdmin.password }
const newAttribute = { firstName: 'Julianna' };
const invalidMail = testdata.fakeMailUser;
const userId = 2;

describe('Document Management System', () => {
  let fakeUserToken;
  let fakeAdminToken;
  // Before running tests, drop all tables and recreate them
  // Create a default user and a default admin
  before(done => {
    db.Role.bulkCreate([{
      title: 'Admin'
    },
    {
      title: 'Regular'
    }]);
    db.User.sync({ force: true }).then(() => {
      request(app)
        .post('/api/v1/user').send(fakeAdmin)
        .then(res => {
          fakeAdminToken = res.body.token;
          request(app)
            .post('/api/v1/user').send(fakeUser)
            .then(response => {
              fakeUserToken = response.body.token;
              done();
            });
        });
    });
  });

  describe('GET /user', () => {
    it('should return a welcome message when api endpoint is hit', (done) => {
      request(app)
        .get('/api')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to the Document Management API!');
          done();
        });
    });

    it('should return a welcome for non existing route', (done) => {
      request(app)
        .get('/api/chew')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to Document management');
          done();
        });
    });
    it('should return message for unauthorized user', (done) => {
      request(app)
        .get('/api/v1/user')
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('You are not logged in');
          done();
        });
    });

    it('should return correct status code for unauthorized user', (done) => {
      request(app)
        .get('/api/v1/user')
        .then((res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should return created user valid firstName and lastName', (done) => {
      request(app)
        .get('/api/v1/user')
        .set('Authorization', fakeAdminToken)
        .expect(200)
        .end((err, res) => {
          expect(res.body[0].firstName).to.equal(fakeAdmin.firstName);
          expect(res.body[0].lastName).to.equal(fakeAdmin.lastName);
          done();
        });
    });

    it('should not return all users to non admin user', (done) => {
      request(app)
        .get('/api/v1/user')
        .set('Authorization', fakeUserToken)
        .expect(200)
        .end((err, res) => {
          expect(res.body.firstName).to.equal(fakeUser.firstName);
          done();
        });
    });

    it('should return all users to admin', (done) => {
      request(app)
        .get('/api/v1/user')
        .set('Authorization', fakeAdminToken)
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(2);
          done();
        });
    });

    it('should return success for fetching single user', (done) => {
      request(app)
        .get(`/api/v1/user?id=${userId}`)
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(302);
          done();
        });
    });

    it('should return correct status code for attribute update', (done) => {
      request(app)
        .put('/api/v1/user').send(newAttribute)
        .set('Authorization', fakeUserToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should return created user with role', (done) => {
      request(app)
        .get('/api/v1/user')
        .set('Authorization', fakeAdminToken)
        .expect(200)
        .end((err, res) => {
          expect(res.body.roleId).to.be.defined;
          done();
        });
    });

    it('should return success mesage after login', (done) => {
      request(app)
        .post('/api/v1/user/login').send(adminCredentials)
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('Login was successful');
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should return correct message and status code for wrong credentials', (done) => {
      request(app)
        .post('/api/v1/user/login').send(wrongPassword)
        .end((err, res) => {
          expect(res.body.message).to.equal('Username or password incorrect');
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should return success status code when user logs out', (done) => {
      request(app)
        .get('/api/v1/user/logout')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
  describe('POST /user', () => {
    it('should return message when existing user create account', (done) => {
      request(app)
        .post('/api/v1/user').send(fakeUser)
        .end((err, res) => {
          expect(res.body.message).to.equal('User already exists');
          done();
        });
    });

    it('should return bad request for invalid email', (done) => {
      request(app)
        .post('/api/v1/user').send(invalidMail)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should return error status code for unauthorized user', (done) => {
      request(app)
        .delete('/api/v1/user?id=2')
        .set('Authorization', fakeUserToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should return success status code when admin deletes user', (done) => {
      request(app)
        .delete(`/api/v1/user?id=${userId}`)
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    after(() => {
      return db.Role.sequelize.sync({ force: true });
    });
  });
});

