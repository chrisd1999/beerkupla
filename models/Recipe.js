const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  recipesName: {
    type: String,
    required: true,
    trim: true,
  },
  usedMalts: {
    type: String,
    required: true,
  },
  usedHops: {
    type: String,
    required: true,
  },
  startGravity: {
    type: String,
    required: true,
  },
  endGravity: {
    type: String,
    required: true,
  },
  bitternesIBU: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
