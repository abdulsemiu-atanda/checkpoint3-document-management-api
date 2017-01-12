import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../../server/models';
import testdata from '../testdata';

const expect = chai.expect;
const fakeUser = testdata.fakeUser;
const fakeAdmin = testdata.fakeAdmin;
const fakeAdminDocument = testdata.fakeAdminDoc;
const fakeUserDocument = testdata.fakeUserDoc;
const docId = 1;
let fakeAdminToken;
let fakeUserToken;

describe('GET /document', () => {
  db.Role.bulkCreate([{
    title: 'Admin'
  },
  {
    title: 'Regular'
  }]);
  before((done) => {
    db.Document.sync({ force: true }).then(() => {
      return db.User.sync({ force: true }).then(() => {
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
  });

  it('should create document with published date and public access', (done) => {
    request(app)
      .post('/api/document').send(fakeUserDocument)
      .set('Authorization', fakeUserToken)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.access).to.equal('public');
        expect({}.hasOwnProperty.call(res.body, 'createdAt')).to.be.true;
        done();
      });
  });

  it('should return error status code for existing document', (done) => {
    request(app)
      .post('/api/document').send(fakeUserDocument)
      .set('Authorization', fakeAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should create admin document', (done) => {
    request(app)
      .post('/api/document').send(fakeAdminDocument)
      .set('Authorization', fakeAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('should return document of specified user', (done) => {
    request(app)
    .get('/api/user/1/document')
    .set('Authorization', fakeAdminToken)
    .end((err, res) => {
      expect(res.body.title).to.equal(fakeAdminDocument.title);
      done();
    });
  });

  it('should return document of specified user', (done) => {
    request(app)
    .get('/api/user/1/document')
    .end((err, res) => {
      expect(res.status).to.equal(401);
      done();
    });
  });

  it('should return error status code for invalid user', (done) => {
    request(app)
      .post('/api/document').send(fakeAdminDocument)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return documents to authorized user', () => {
    request(app)
      .get('/api/document')
      .set('Authorization', fakeAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
      });
  });

  it('should order document when specified', () => {
    request(app)
    .get('/api/document?order=order')
    .set('Authorization', fakeUserToken)
    .end((err, res) => {
      expect(res.status).to.equal(200);
    });
  });

  it('should return error status code to unauthorized user', () => {
    request(app)
      .get('/api/document')
      .end((err, res) => {
        expect(res.status).to.equal(401);
      });
  });

  it('should return success when document is deleted', () => {
    request(app)
      .delete(`/api/document?id=${docId}`)
      .set('Authorization', fakeAdminToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document deleted');
      });
  });

  it('should return error for unauthorized user', () => {
    request(app)
      .delete(`/api/document?id=${docId}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
      });
  });
});
