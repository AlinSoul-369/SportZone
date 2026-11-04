const Expect = require('../models/expect');

// Get all expects, optionally filtered by userId
exports.getAllExpects = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const expects = await Expect.find(filter)
      .populate('userId', 'fullname email')
      .populate('matchId', 'team1 team2 date status winner result');

    res.status(200).json({
      status: 'success',
      results: expects.length,
      expects
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expects', error: error.message });
  }
};

// Create a new expect
exports.createExpect = async (req, res) => {
  try {
    const { userId, matchId, expectedWinner, expectedResult } = req.body;

    if (!userId || !matchId || !expectedWinner || !expectedResult) {
      return res.status(400).json({
        message: 'userId, matchId, expectedWinner, and expectedResult are required'
      });
    }

    const newExpect = await Expect.create({
      userId,
      matchId,
      expectedWinner,
      expectedResult
    });

    res.status(201).json({
      message: 'Expect created successfully',
      expect: newExpect
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create expect', error: error.message });
  }
};
