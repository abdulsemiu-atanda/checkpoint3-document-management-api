import db from '../models';
import Auth from './auth';

/**
 * Document class that handle all document related actions
 */
class DocumentController {
  /**
   * Method that handles post request for creating new document in database
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
    .catch(err =>{
      res.status(400).send(err);
    });
  }
}

export default DocumentController;
