import chai from 'chai';
import db from '../../server/models';
import testdata from '../testdata';

const expect = chai.expect;
const Role = db.Role;
const roleParams = testdata.role;
let role;

describe('Role Model', () => {
  before(() => {
    role = Role.build(roleParams);
  });

  after(() => Role.sequelize.sync({ force: true }));

  it('should create a role', () => {
    expect(role).to.exist;
  });

  it('should have a title', () => {
    expect(role.title).to.equal(roleParams.title);
  });

  it('insert correct attribute to database', () => {
    role.save().then(newRole => {
      expect(newRole.title).to.equal(roleParams.title);
    });
  });

  it('should not insert empty title into database', () => {
    Role.create({})
    .then(newRole => {
      expect(newRole.title).to.not.exist;
    }).catch(err => {
      expect(/notNull/.test(err.message)).to.be.true;
    });
  });
});
