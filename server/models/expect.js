const mongoose = require('mongoose');

const expectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  expectedWinner: {
    type: String,
    required: true,
    trim: true
    },
  expectedResult: {
    type: String,
    required: true,
    trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Expect', expectSchema);