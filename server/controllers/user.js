import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
          const newToken = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            roleId: user.RoleId
          }, secret, { expiresIn: '24h' });
          return res.status(201)
            .send({
              message: 'User created and token expires in a day',
              token: newToken
            });
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
        user.update(req.body).then((result) => {
          const newToken = jwt.sign({
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            username: result.username,
            password: result.password,
            roleId: result.RoleId
          }, secret, { expiresIn: '24h' });
          return res.status(202)
            .send({
              message: 'user firstName has been updated',
              token: newToken
            });
        });
      });
  }
  /**
   * Methods that logs in user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with appropriate status
   */
  static login(req, res) {
    db.User.findOne({
      where: {
        username: req.query.username
      }
    })
      .then(result => {
        bcrypt.compare(req.query.password, result.password, (err, response) => {
          if (response) {
            res.status(200).send({ message: 'Login was successful' });
          } else {
            res.status(404).send({ message: 'Username or password incorrect' });
          }
        });
      });
  }

  /**
   * Methods that logs out user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with appropriate status
   */
  static logout(req, res) {
    res.status(200).send({ message: 'Log out successful' });
  }
  /**
   * Method that handles fetching user details
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with status and decoded token or error
   */
  static fetchDetails(req, res) {
    const userDetails = Auth.verify(req.headers.authorization);
    if (req.headers.authorization === undefined || userDetails === false) {
      res.status(401).send({ message: 'Invalid credentials' });
      return false;
    } else if (req.query.id === undefined) {
      db.User.findAll({
        where: {
          password: userDetails.password
        }
      }).spread(result => res.status(302).send({
        id: result.id,
        name: {
          firstName: result.firstName,
          lastName: result.lastName
        },
        email: result.email,
        password: result.password,
        roleId: result.RoleId
      }));
    } else {
      db.User.findOne({
        where: {
          id: req.query.id
        }
      }).then(result => res.status(302).send({
        id: result.id,
        name: {
          firstName: result.firstName,
          lastName: result.lastName
        },
        email: result.email,
        password: result.password,
        roleId: result.RoleId
      }));
    }
  }
  /**
   * Method that handles deleting user details
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with status and decoded token or error
   */
  static discard(req, res) {
    const userDetails = Auth.verify(req.headers.authorization);
    if (userDetails.roleId !== 1 || userDetails === false) {
      res.status(401).send({ message: 'Invalid credentials' });
      return false;
    }
    db.User.destroy({
      where: {
        id: req.query.id
      },
      truncate: true
    })
    .then(() => {
      res.status(200).send({ message: 'User successfuly deleted' });
    });
  }
}

export default User;
