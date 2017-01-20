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
        res.status(302).send(err);
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
    if (req.query.order || req.query.limit) {
      if (req.query.limit < 0) {
        res.status(400).send({ message: 'Only positive integers can be id' });
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
    } else if (req.query.date) {
      db.Document.findAll({
        where: {
          createdAt: {
            $lte: new Date(req.query.date)
          }
        }
      }).then(result => {
        res.status(200).send(result);
      });
    } else {
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
    }
  }
  /**
     * Method that fetches specified user document
     * @param {Object} req
     * @param {Object} res
     * @return {Object} response
     */
  static fetchUserDoc(req, res) {
    const convert = parseInt(req.params.id, 10);
    if (req.params.id < 0) {
      res.status(400).send({
        message: 'Only positive integers can be id'
      });
      return false;
    }
    db.Document.findAll({
      where: {
        OwnerId: convert
      }
    })
      .then(docs => {
        if (docs.length > 0) {
          res.status(200).send(docs);
        } else {
          res.status(404).send({ message: 'Document does not exist' });
        }
      });
  }
  /**
   * Method that handles request for updating documents
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static update(req, res) {
    if (req.params.id < 0) {
      res.status(400).send({ message: 'Only positive integers can be id' });
    } else {
      db.Document.findOne({
        where: {
          id: parseInt(req.params.id, 10)
        }
      })
        .then(document => {
          document.update(req.body)
            .then(result => {
              res.status(202).send(result);
            });
        });
    }
  }
  /**
   * Method that handles request for fetching role documents
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static access(req, res) {
    const decoded = Auth.verify(req.headers.authorization);
    if (/admin/i.test(req.params.role)) {
      db.Document.all()
        .then(docs => {
          res.status(200).send(docs);
        });
    } else {
      db.Document.findAll({
        where: {
          $or: [
            { OwnerId: decoded.id },
            { access: 'public' }
          ]
        }
      }).then(docs => {
        res.status(200).send(docs);
      });
    }
  }
  /**
   * Method that handles request for deleting documents
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static discard(req, res) {
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
