const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');

const validateBody = async (req, res, next) => {
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty or invalid' });
  }

  try {
    const tempArt = new Artwork(body);
    await tempArt.validate();
    next();
  } catch (err) {
    return res.status(400).json({
      error: `Schema validation failed`,
      details: err.errors,
    });
  }
}

const validateIdField = (req, res, next) => {
  const id = req.params.id;

  if(!id) {
    return res.status(400).send({ error: 'ID must be defined' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid Id format' });
  }

  next();
}


module.exports = {
  validateBody,
  validateIdField
};
