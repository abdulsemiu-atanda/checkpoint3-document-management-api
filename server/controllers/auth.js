import jwt from 'jsonwebtoken';

require('dotenv').config();

const secret = process.env.SECRET;

/**
 * Authentication class that handles registered user verification
 */
class Authentication {
  /**
   * Method that handles verification of jsonwebtoken
   * @param {Object} token
   * @return {Object} response decoded token or error
   */
  static verify(token) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (err) {
      return false;
    }
  }
  /**
   * Method that handles verification of jsonwebtoken
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @return {Object} response decoded token or error
   */
  static adminUser(req, res, next) {
    const adminUser = Authentication.verify(req.headers.authorization);
    if (adminUser === false || adminUser.roleId !== 1) {
      res.status(401).send({ message: 'Invalid access level' });
    } else {
      next();
    }
  }
  /**
   * Method that handles verification of jsonwebtoken
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @return {Object} response decoded token or error
   */
  static validUser(req, res, next) {
    const user = Authentication.verify(req.headers.authorization);
    if (user === false) {
      res.status(401).send({ message: 'You are not logged in' });
    } else {
      next();
    }
  }
}

export default Authentication;
