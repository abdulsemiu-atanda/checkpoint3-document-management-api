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
    } else if (req.query.order === undefined && req.query.limit === undefined) {
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
        });
    } else {
      db.Document.findAll({
        order: '"createdAt" DESC',
        where: {
          $or: [
            { OwnerId: decoded.id },
            { access: 'public' }
          ]
        },
        limit: req.query.limit || 5
      })
        .then((docs) => {
          res.status(200).send(docs);
        });
    }
  }
  /**
     * Method that fetches specified user document
     * @param {Object} req
     * @param {Object} res
     * @return {Object} response
     */
  static fetchUserDoc(req, res) {
    const decoded = Auth.verify(req.headers.authorization);
    if (decoded === false) {
      res.status(401).send({ message: 'Invalid credentials' });
      return false;
    }
    db.Document.findAll({
      where: {
        OwnerId: req.params.id
      }
    })
      .spread(docs => {
        res.status(200).send(docs);
      });
  }
  /**
   * Method that handles request for updating documents
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static update(req, res) {
    const userDetail = Auth.verify(req.headers.authorization);
    if (userDetail === false) {
      res.status(401).send({ message: 'You are not authorized' });
      return false;
    }
    db.Document.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(document => {
      document.update(req.body)
      .then(result => {
        res.status(202).send(result);
      });
    });
  }
  /**
   * Method that handles request for deleting documents
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static discard(req, res) {
    const decoded = Auth.verify(req.headers.authorization);
    if (decoded === false) {
      res.status(401).send({ message: 'Invalid credentials' });
      return false;
    }
    db.Document.destroy({
      where: {
        id: req.query.id
      },
      truncate: true
    })
      .then(() => {
        res.status(200).send({ message: 'Document deleted' });
      });
  }
}

export default DocumentController;
