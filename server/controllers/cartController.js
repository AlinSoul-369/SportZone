const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');

// Get all carts, one cart by id, or all carts for a specific user
exports.getCarts = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    let filter = {};

    if (id) {
      filter._id = id;
    } else if (userId) {
      filter.userId = userId;
    }

    const carts = await Cart.find(filter)
      .populate('userId', 'fullname email balance')
      .populate('items.productId', 'name price');

    if (id && carts.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({
      status: 'success',
      results: carts.length,
      carts
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch carts', error: error.message });
  }
};

// Get monthly earnings for all carts in the current year
exports.getMonthlyEarnings = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const monthlyEarnings = await Cart.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          totalEarnings: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const earningsByMonth = new Map(
      monthlyEarnings.map(item => [item._id.month, item.totalEarnings])
    );

    const response = monthNames.map((month, index) => ({
      month,
      totalEarnings: earningsByMonth.get(index + 1) || 0
    }));

    res.status(200).json({
      status: 'success',
      year: currentYear,
      monthlyEarnings: response
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to calculate monthly earnings',
      error: error.message
    });
  }
};

// Get total earnings for the current year
exports.getCurrentYearEarnings = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const result = await Cart.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalEarnings = result[0] ? result[0].totalEarnings : 0;

    res.status(200).json({
      status: 'success',
      year: currentYear,
      totalEarnings
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to calculate current year earnings',
      error: error.message
    });
  }
};

// Create cart and deduct totalPrice from user balance (supports appliedOffer)
exports.createCart = async (req, res) => {
  try {
    const { userId, items, appliedOffer } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'userId and at least one item are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let totalPrice = 0;

    for (const item of items) {
      if (!item.productId || item.quantity === undefined || item.quantity <= 0) {
        return res.status(400).json({
          message: 'Each item must include a valid productId and quantity greater than 0'
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${item.productId}`
        });
      }

      totalPrice += product.price * item.quantity;
    }

    // apply offer if provided (assume percentage number, e.g., 15 means 15%)
    let discountAmount = 0;
    let finalPrice = totalPrice;
    if (appliedOffer && typeof appliedOffer === 'number' && appliedOffer > 0) {
      discountAmount = (totalPrice * appliedOffer) / 100;
      finalPrice = Math.max(0, totalPrice - discountAmount);
    }

    if (user.balance < finalPrice) {
      return res.status(400).json({
        message: 'Insufficient balance for this cart'
      });
    }

    // create cart record including offer info
    const newCart = await Cart.create({
      userId,
      items,
      totalPrice,
      appliedOffer: appliedOffer || null,
      discountAmount,
      finalPrice
    });

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    user.balance -= finalPrice;

    // consume the offer if it exists on the user (remove one instance)
    if (appliedOffer && Array.isArray(user.offers)) {
      const idx = user.offers.indexOf(appliedOffer);
      if (idx !== -1) {
        user.offers.splice(idx, 1);
      }
    }

    await user.save();

    res.status(201).json({
      message: 'Cart created successfully',
      cart: newCart,
      remainingBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create cart', error: error.message });
  }
};
