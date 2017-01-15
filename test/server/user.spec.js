import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../../server/models';
import testdata from '../testdata';

const expect = chai.expect;
const wrongPassword = 'julio';
const fakeUser = testdata.fakeUser;
const fakeAdmin = testdata.fakeAdmin;
const newAttribute = { firstName: 'Julianna' };
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
        .post('/api/user').send(fakeAdmin)
        .then(res => {
          fakeAdminToken = res.body.token;
          request(app)
            .post('/api/user').send(fakeUser)
            .then(response => {
              fakeUserToken = response.body.token;
              done();
            });
        });
    });
  });

  describe('GET /user', () => {
    it('should return a welcome message when api endpoint is hit', () => {
      request(app)
        .get('/api')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to the Document Management API!');
        });
    });

    it('should return a welcome for non existing route', () => {
      request(app)
        .get('/api/chew')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to Document management');
        });
    });
    it('should return message for unauthorized user', (done) => {
      request(app)
        .get('/api/user')
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('No credentials were provided');
          done();
        });
    });

    it('should return correct status code for unauthorized user', (done) => {
      request(app)
        .get('/api/user')
        .then((res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should return created user valid firstName', (done) => {
      request(app)
        .get('/api/user')
        .set('Authorization', fakeAdminToken)
        .expect(200)
        .end((err, res) => {
          expect(res.body.name.firstName).to.equal(fakeAdmin.firstName);
          done();
        });
    });

    it('should return success for fetching single user', (done) => {
      request(app)
        .get(`/api/user?id=${userId}`)
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(302);
          done();
        });
    });

    it('should return created user valid firstName', (done) => {
      request(app)
        .get('/api/user')
        .set('Authorization', fakeUserToken)
        .expect(200)
        .end((err, res) => {
          expect(res.body.name.firstName).to.equal(fakeUser.firstName);
          done();
        });
    });

    it('should return correct status code for attribute update', () => {
      request(app)
        .put('/api/user').send(newAttribute)
        .set('Authorization', fakeUserToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
        });
    });

    it('should return created user with role', (done) => {
      request(app)
        .get('/api/user')
        .set('Authorization', fakeAdminToken)
        .expect(200)
        .end((err, res) => {
          expect({}.hasOwnProperty.call(res.body, 'roleId')).to.be.true;
          done();
        });
    });

    it('should return success mesage after login', (done) => {
      request(app)
        .get(`/api/user/login?username=${fakeAdmin.username}&password=${fakeAdmin.password}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('Login was successful');
          done();
        });
    });

    it('should return correct status code after successful login', (done) => {
      request(app)
        .get(`/api/user/login?username=${fakeAdmin.username}&password=${fakeAdmin.password}`)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should return correct message and status code for wrong credentials', (done) => {
      request(app)
        .get(`/api/user/login?username=${fakeUser.username}&password=${wrongPassword}`)
        .end((err, res) => {
          expect(res.body.message).to.equal('Username or password incorrect');
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should return success status code when user logs out', () => {
      request(app)
        .get('/api/user/logout')
        .end((err, res) => {
          expect(res.status).to.equal(200);
        });
    });
  });
  describe('POST /user', () => {
    it('should return message when existing user create account', (done) => {
      request(app)
        .post('/api/user').send(fakeUser)
        .end((err, res) => {
          expect(res.body.message).to.equal('User already exists');
          done();
        });
    });

    it('should return correct status code for recreating user', (done) => {
      request(app)
        .post('/api/user').send(fakeUser)
        .end((err, res) => {
          expect(res.status).to.equal(302);
          done();
        });
    });

    it('should return error status code for unauthorized user', (done) => {
      request(app)
        .delete('/api/user?id=2')
        .set('Authorization', fakeUserToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should return success status code when admin deletes user', (done) => {
      request(app)
        .delete(`/api/user?id=${userId}`)
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    after(() => {
      db.sequelize.sync({ force: true });
    });
  });
});

