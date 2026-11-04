const User = require('../models/user');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, phone, role, balance } = req.body;

    if (!fullname || !email || !password || !phone) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({
      fullname,
      email,
      password,
      phone,
      role: role || 'user',
      balance: balance || 0,
      offers: []
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get one user by ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Increase user balance
exports.addBalance = async (req, res) => {
  try {
    const { email } = req.body;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { balance: Number(amount) } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Balance updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update balance', error: error.message });
  }
};

// Remove one offer from a specific user's offers array
exports.removeOneOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.offers) || user.offers.length === 0) {
      return res.status(400).json({ message: 'This user has no offers to remove' });
    }

    user.offers.pop();
    await user.save();

    res.status(200).json({
      message: 'One offer removed successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove offer', error: error.message });
  }
};

// Get total count of all offers across all users
exports.getTotalOffersCount = async (req, res) => {
  try {
    const users = await User.find({}, 'offers');

    const totalOffers = users.reduce((sum, user) => {
      const offers = Array.isArray(user.offers) ? user.offers.length : 0;
      return sum + offers;
    }, 0);

    res.status(200).json({
      status: 'success',
      totalOffers
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count offers', error: error.message });
  }
};
