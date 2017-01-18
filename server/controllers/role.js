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
      if (req.query.title === undefined) {
        db.Role.all()
          .then((role) => {
            res.status(201).send(role);
          });
      } else {
        db.Role.findOne({
          where: {
            title: req.query.title
          }
        })
          .then((role) => {
            res.status(201).send(role);
          });
      }
    } else {
      res.status(402).send({ message: 'You are not an Admin' });
    }
  }

  /**
     * Method that handles retrieving roles
     * @param {Object} req
     * @param {Object} res
     * @return {Object} response with appropriate status message
     */
  static discard(req, res) {
    const userDetails = Auth.verify(req.headers.authorization);
    if (userDetails.roleId !== 1 || userDetails === false) {
      res.status(401).send({ message: 'Invalid credentials' });
      return false;
    }
    db.Role.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        if (result === 1) {
          res.status(200).send({
            message: 'Role successfully deleted'
          });
        } else {
          res.status(404).send({ message: 'Role does not exist' });
        }
      });
  }
}

export default Role;
