import chai from 'chai';
import db from '../../server/models';
import testdata from '../testdata';

const expect = chai.expect;
const Role = db.Role;
const User = db.User;
const newUser = testdata.modelUser;
const roleParams = testdata.role;
const fakeUser = testdata.fakeUser;
const fakeRoleUser = testdata.noRoleUser;
const updateAttr = { firstName: 'Dean' };
let role;
let user;

describe('User Model', () => {
  before(() => {
    role = Role.build(roleParams);
    user = User.build(newUser);
    role.save();
  });

  after(() => Role.sequelize.sync({ force: true }));

  it('user model instance should exist', () => {
    expect(user).to.exist;
  });

  it('should save correct attributes to database with password not plain', () => {
    user.save()
    .then(saveUser => {
      expect(saveUser.username).to.equal(newUser.username);
      expect(saveUser.lastName).to.equal(newUser.lastName);
      expect(saveUser.password).to.not.equal(newUser.password);
    });
  });

  it('should not create new user with existing unique attribute', () => {
    user.save()
    .then(duplicate => {
      expect(duplicate).to.not.exist;
    })
    .catch(err => {
      expect(err.errors[0].message).to.equal('email must be unique');
    });
  });
  it('should update user attribute with correct values', () => {
    User.findOne({
      where: {
        id: 1
      }
    }).then(result => {
      result.update(updateAttr)
      .then(attr => {
        expect(attr.firstName).to.equal(updateAttr.firstName);
      });
    });
  });

  it('should not create user whose role does not exist', () => {
    user = User.build(fakeRoleUser);
    user.save()
    .then(savedUser => {
      expect(savedUser).to.not.exist;
    })
    .catch(err => {
      expect(/constraint/.test(err.message)).to.be.true;
    });
  });

  it('should not insert in database if notNull attribute is missing', () => {
    user = User.build(fakeUser);
    user.save()
    .then(savedUser => {
      expect(savedUser).to.not.exist;
    }).catch(err => {
      expect(/notNull/.test(err.message)).to.be.true;
    });
  });
});
