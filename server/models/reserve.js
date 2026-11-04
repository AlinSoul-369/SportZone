const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  AdvancePayment: {
    type: Number,
    required: true
},
  time: {
    type: String,
    required: true
  }
},
{ timestamps: true });

module.exports = mongoose.model('Reserve', reserveSchema);