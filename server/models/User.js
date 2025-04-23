const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }]
});

module.exports = mongoose.model('User', userSchema);
