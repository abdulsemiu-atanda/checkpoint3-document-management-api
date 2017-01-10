import Auth from './auth';
import db from '../models';

/**
 * Role class that handles all role related actions
 */
class Role {
  /**
   * Method that handles role creation
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with appropriate status message
   */
  static create(req, res) {
    const validUser = Auth.verify(req.headers.authorization);
    if (validUser === false || validUser.id !== 1) {
      res.status(401).send({ message: 'Invalid Credentials' });
      return false;
    }
    db.Role.create({
      title: req.body.title
    })
      .then((role) => {
        res.status(201).send(role);
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  }

  /**
   * Method that handles retrieving roles
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response with appropriate status message
   */
  static list(req, res) {
    const adminUser = Auth.verify(req.headers.authorization);
    if (adminUser.roleId === 1 && adminUser !== false) {
      db.Role.all()
        .then((role) => {
          res.status(201).send(role);
        });
    } else {
      res.status(402).send({ message: 'You are not an Admin' });
    }
  }
}

export default Role;
