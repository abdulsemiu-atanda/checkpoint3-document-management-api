import db from '../models';
import Auth from './auth';

/**
 * Document class that handle all document related actions
 */
class DocumentController {
  /**
   * Method that handles request for creating new document
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static create(req, res) {
    const decoded = Auth.verify(req.headers.authorization);
    db.Document.create({
      title: req.body.title,
      content: req.body.content,
      OwnerId: decoded.id,
      access: req.body.access
    })
      .then(doc => {
        res.status(201).send(doc);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }
  /**
   * Method that handles request for listing documents
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static list(req, res) {
    const decoded = Auth.verify(req.headers.authorization);
    if (decoded === false) {
      res.status(401).send({ message: 'Invalid credentials' });
      return false;
    }
    db.Document.findAll({
      where: {
        $or: [
          { OwnerId: decoded.id },
          { access: 'public' }
        ]
      }
    })
      .then(docs => {
        res.status(200).send(docs);
      })
      .catch(err => {
        res.status(404).send(err);
      });
  }
}

export default DocumentController;
