const Match = require('../models/match');
const Expect = require('../models/expect');
const User = require('../models/user');

// Get all matches, or filter by status if provided
exports.getMatches = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const matches = await Match.find(filter).sort({ date: 1 });

    res.status(200).json({
      status: 'success',
      results: matches.length,
      matches
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch matches', error: error.message });
  }
};

// Create a new match
exports.createMatch = async (req, res) => {
  try {
    const { team1, team2, date, status } = req.body;

    if (!team1 || !team2 || !date) {
      return res.status(400).json({
        message: 'team1, team2, and date are required'
      });
    }

    const newMatch = await Match.create({
      team1,
      team2,
      date,
      status: status || 'upcoming'
    });

    res.status(201).json({
      message: 'Match created successfully',
      match: newMatch
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create match', error: error.message });
  }
};

// Update a match
exports.updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(200).json({
      message: 'Match updated successfully',
      match: updatedMatch
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update match', error: error.message });
  }
};

// Delete a match
exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMatch = await Match.findByIdAndDelete(id);

    if (!deletedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(200).json({
      message: 'Match deleted successfully',
      match: deletedMatch
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete match', error: error.message });
  }
};

// Apply match result and reward users whose expectations match
exports.applyMatchResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { winner, result } = req.body;

    if (!winner || !result) {
      return res.status(400).json({
        message: 'winner and result are required'
      });
    }

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.winner = winner;
    match.result = result;
    match.status = 'completed';
    await match.save();

    const expectations = await Expect.find({ matchId: id });

    for (const expectItem of expectations) {
      const isWinnerMatch = expectItem.expectedWinner === winner;
      const isResultMatch = expectItem.expectedResult === result;

      if (isWinnerMatch && isResultMatch) {
        const user = await User.findById(expectItem.userId);
        if (user) {
          if (!Array.isArray(user.offers)) {
            user.offers = [];
          }
          user.offers.push(15);
          await user.save();
        }
      }
    }

    res.status(200).json({
      message: 'Match result applied successfully',
      match
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply match result', error: error.message });
  }
};

// ✅ جلب اللاعبين الذين توقعوا النتيجة الصحيحة - نسخة بديلة
exports.getCorrectPredictors = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🔍 Fetching correct predictors for match:', id);

    // 1. جلب المباراة
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    console.log('📊 Match:', match.team1, 'vs', match.team2);
    console.log('📊 Winner:', match.winner);
    console.log('📊 Result:', match.result);

    // 2. التأكد من أن المباراة منتهية
    if (match.status !== 'completed' || !match.winner || !match.result) {
      return res.status(200).json({ 
        status: 'success',
        message: 'Match is not completed yet',
        correctPredictors: [],
        total: 0
      });
    }

    // ✅ 3. جلب جميع التوقعات لهذه المباراة
    const allExpects = await Expect.find().populate('userId', 'fullname email phone');
    
    // ✅ 4. فلترة التوقعات الصحيحة يدوياً
    const correctExpects = allExpects.filter(exp => {
      const matchIdStr = exp.matchId?.toString() || '';
      const targetId = id?.toString() || '';
      return matchIdStr === targetId && 
             exp.expectedWinner === match.winner && 
             exp.expectedResult === match.result;
    });

    console.log('✅ Correct expects found:', correctExpects.length);

    // 5. استخراج بيانات المستخدمين
    const correctPredictors = correctExpects.map(exp => ({
      fullname: exp.userId?.fullname || 'Unknown',
      email: exp.userId?.email || 'N/A',
      phone: exp.userId?.phone || 'N/A',
      expectedWinner: exp.expectedWinner,
      expectedResult: exp.expectedResult
    }));

    res.status(200).json({
      status: 'success',
      match: `${match.team1} vs ${match.team2}`,
      result: match.result,
      winner: match.winner,
      correctPredictors,
      total: correctPredictors.length
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch correct predictors', 
      error: error.message 
    });
  }
};