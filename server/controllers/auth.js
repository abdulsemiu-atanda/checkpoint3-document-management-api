import jwt from 'jsonwebtoken';
import db from '../models';

const secret = process.env.SECRET || 'tshabalala';

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
   * @return {Object} response with status and decoded token or error
   */
  static login(req, res) {
    const userDetails = Authentication.verify(req.headers.authorization);
    if (req.headers.authorization === undefined || userDetails === false) {
      res.status(401).send({ message: 'Invalid credentials' });
    }
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
      password: result.password
    }))
      .catch(err => {
        res.status(404).send(err);
      });
  }
}

export default Authentication;
