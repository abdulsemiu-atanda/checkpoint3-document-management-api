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
}

export default Authentication;
