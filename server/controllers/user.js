import jwt from 'jsonwebtoken';
import db from '../models';
import Auth from './auth';

const secret = 'tshabalala';
/**
 * User class that handles all user related actions
 */
class User {
  /**
   * Methods that creates user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with appropriate status
   */
  static create(req, res) {
    db.User.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        RoleId: req.body.roleId
      }
    })
      .spread((user, created) => {
        if (created) {
          const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password
          }, secret, { expiresIn: '24h' });
          return res.status(201)
            .send({ message: `User created Token: ${token} expires in a day` });
        }
        return res.status(302).send({ message: 'User already exists' });
      });
  }
  /**
   * Methods that updates user attributes
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with appropriate status
   */
  static update(req, res) {
    const detail = Auth.verify(req.headers.authorization);
    db.User.findOne({
      where: {
        id: detail.id
      }
    })
      .then(user => {
        user.update({
          firstName: req.body.firstName
        }).then((result) => {
          const newToken = jwt.sign({
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            username: result.username,
            password: result.password
          }, secret, { expiresIn: '24h' });
          return res.status(202)
            .send({
              message: `User created Token: ${newToken} expires in a day`
            });
        });
      });
  }
}

export default User;
