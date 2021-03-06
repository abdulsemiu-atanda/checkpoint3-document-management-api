import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models';
import Auth from './auth';

require('dotenv').config();

const secret = process.env.SECRET;
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
    const emailRegex = /^\S+@\S+$/g;
    if (emailRegex.test(req.body.email)) {
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
            const refreshToken = bcrypt.hashSync(`${user.username}${user.id}${user.email}`, bcrypt.genSaltSync(8));

            return res.status(201)
              .send({
                message: 'User created and token expires in a day',
                token: newToken,
                refreshToken
              });
          }
          return res.status(409).send({ message: 'User already exists' });
        });
    } else {
      res.status(400).send({ message: 'Invalid Email' });
    }
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
        user.update(req.body).then((response) => {
          return res.status(200)
            .send({
              message: 'user attribute has been updated',
              newDetails: response
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
        username: req.body.username
      }
    })
      .then(result => {
        if (result) {
          bcrypt.compare(req.body.password, result.password, (err, response) => {
            if (response) {
              const newToken = jwt.sign({
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                username: result.username,
                password: result.password,
                roleId: result.RoleId
              }, secret, { expiresIn: '24h' });
              const refreshToken = bcrypt.hashSync(`${result.username}${result.id}${result.email}`, bcrypt.genSaltSync(8));

              res.status(200).send({
                message: 'Login was successful',
                token: newToken,
                refreshToken
              });
            } else {
              res.status(400).send({ message: 'Username or password incorrect' });
            }
          });
        } else {
          res.status(404).send({ message: 'Username or password incorrect' });
        }
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
    const detail = Auth.verify(req.headers.authorization);
    if (req.query.refreshToken) {
      bcrypt.compare(`${detail.username}${detail.id}${detail.email}`, req.query.refreshToken, (err, result) => {
        if (result) {
          const { id, firstName, lastName, email, username, roleId } = detail;
          const newToken = jwt.sign({
            id,
            firstName,
            lastName,
            email,
            roleId,
            username
          }, secret, { expiresIn: '48h' });

          res.status(200).send({
            message: 'Token expires in two days',
            token: newToken,
            refreshToken: req.query.refreshToken
          });
        } else {
          res.status(400).send({ message: 'Invalid refresh token' });
        }
      });
    } else if (req.query.id === undefined) {
      if (detail.roleId !== 1) {
        db.User.findOne({
          where: {
            id: detail.id
          },
          attributes: ['id', 'firstName', 'lastName', 'email', 'RoleId']
        }).then(user => {
          res.status(200).send(user);
        });
      } else {
        db.User.findAll({
          attributes: ['id', 'firstName', 'lastName', 'email', 'RoleId']
        })
          .then(result => {
            res.status(200).send(result);
          });
      }
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
  /**
   * Method that handles deleting user details
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with status and new token or error
   */
  static refreshToken(req, res) {
    const decoded = Auth.verify(req.headers.authorization);
    if (req.params.refreshToken) {
      bcrypt.compare(`${decoded.username}${decoded.id}${decoded.email}`, req.params.refreshToken, (err, result) => {
        if (result) {
          const { id, firstName, lastName, email, username, roleId } = decoded;
          const newToken = jwt.sign({
            id,
            firstName,
            lastName,
            email,
            roleId,
            username
          }, secret, { expiresIn: '48h' });

          res.status(200).send({
            message: 'Token expires in two days',
            token: newToken,
            refreshToken: req.params.refreshToken
          });
        } else {
          res.status(400).send({ message: 'Invalid refresh token' });
        }
      });
    }
  }
}

export default User;
