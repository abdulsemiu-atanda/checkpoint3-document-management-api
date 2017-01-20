import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../../server/models';
import testdata from '../testdata';

const expect = chai.expect;

const fakeUser = testdata.fakeUser;
const fakeAdmin = testdata.fakeAdmin;
const newRole = { title: 'role' };
let fakeAdminToken;
let fakeUserToken;

describe('Roles', () => {
  // Before running tests, drop all tables and recreate them
  // Create a default user and a default admin
  before((done) => {
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

  describe('GET /role', () => {
    it('should return message for non admin user', (done) => {
      request(app)
        .get('/api/role')
        .set('Authorization', fakeUserToken)
        .end((err, res) => {
          expect(res.body.message).to.equal('You are not an admin');
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should return success status code for admin', (done) => {
      request(app)
        .get('/api/role')
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should return correct status code for invalid user', (done) => {
      request(app)
        .post('/api/role').send(newRole)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });


    it('should return success status code for new role', (done) => {
      request(app)
        .post('/api/role').send(newRole)
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should return error status for existing role', (done) => {
      request(app)
        .post('/api/role').send(newRole)
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should return success for admin role', (done) => {
      request(app)
        .get('/api/role?title=Admin')
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should return success for regular role', (done) => {
      request(app)
        .get('/api/role?title=Regular')
        .set('Authorization', fakeAdminToken)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });
  });

  it('should allow admin delete role', (done) => {
    request(app)
      .delete('/api/role/2')
      .set('Authorization', fakeAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should not allow unauthorized user delete role', (done) => {
    request(app)
      .delete('/api/role/3')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return not found for non existing role', (done) => {
    request(app)
      .delete('/api/role/3')
      .set('Authorization', fakeAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should return bad request for negative id', (done) => {
    request(app)
      .delete('/api/role/-3')
      .set('Authorization', fakeAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  after(() =>
    db.Role.sync({ force: true })
  );
});

