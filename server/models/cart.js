const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  // original total before discounts
  totalPrice: {
    type: Number,
    default: 0
  },
  // optional applied offer (percentage)
  appliedOffer: {
    type: Number,
    default: null
  },
  // computed discount amount
  discountAmount: {
    type: Number,
    default: 0
  },
  // final price after discount
  finalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true });
module.exports = mongoose.model('Cart', cartSchema);