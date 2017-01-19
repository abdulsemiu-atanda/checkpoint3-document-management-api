import chai from 'chai';
import db from '../../server/models';
import testdata from '../testdata';

const expect = chai.expect;
const newUser = testdata.modelUser;
const Role = db.Role;
const User = db.User;
const Document = db.Document;
const roleParams = testdata.role;
const newDoc = testdata.modelDoc;
const fakeDoc = testdata.fakeAdminDoc;
const accessDoc = testdata.fakeUserDoc;
let document;
let ownerId;

describe('Document Model', () => {
  before(() =>
    Role.create(roleParams)
      .then(() => {
        return User.create(newUser);
      })
      .then((user) => {
        ownerId = user.id;
        document = Document.build(newDoc);
      }));
  after(() => User.sequelize.sync({ force: true }));

  it('should have an instance of document', () => {
    expect(document).to.exist;
  });

  it('should save document with title and content with no error', () => {
    document.save()
      .then(newDocument => {
        expect(newDocument.title).to.equal(newDoc.title);
        expect(newDocument.content).to.equal(newDoc.content);
      }).catch(err => {
        expect(err).to.not.exist;
      });
  });

  it('should not create document with null attribute', () => {
    Document.create({})
    .then(savedDoc => {
      expect(savedDoc).to.not.exist;
    }).catch(err => {
      expect(/notNull/.test(err.message)).to.be.true;
    });
  });

  it('should return error if document title exists', () => {
    document = Document.build(newDoc);
    document.save()
      .then(savedDoc => {
        expect(savedDoc).to.not.exist;
      }).catch(err => {
        expect(err.errors[0].message).to.equal('title must be unique');
      });
  });

  it('save document with public as default access', () => {
    fakeDoc.OwnerId = ownerId;
    document = Document.build(fakeDoc);
    document.save()
      .then(newDocument => {
        expect(newDocument.access).to.equal('public');
      });
  });

  it('should not create document with invalid access', () => {
    accessDoc.access = 'smith';
    accessDoc.OwnerId = ownerId;
    document = Document.build(accessDoc);
    document.save()
      .then(savedDoc => {
        expect(savedDoc).to.not.exist;
      }).catch(err => {
        expect(err.errors[0].message).to.equal('Validation isIn failed');
      });
  });
});
