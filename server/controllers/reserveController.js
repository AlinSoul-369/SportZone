const Reserve = require('../models/reserve');
const User = require('../models/user');

const SLOT_START_HOURS = [9, 11, 13, 15, 17, 19, 21];

const overlaps = (startA, endA, startB, endB) => {
  return startA < endB && endA > startB;
};

const normalizeDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatLocalDateTime = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const buildDaySlots = (baseDate) => {
  const day = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate()
  );

  return SLOT_START_HOURS.map((hour) => {
    const start = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      hour,
      0,
      0,
      0
    );
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    return {
      start,
      end,
      startLabel: formatTime(start),
      endLabel: formatTime(end)
    };
  });
};

const getStartOfDay = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};


exports.getAllReserves = async (req, res) => {
  try {
    const { userId } = req.query;
    let filter = {};

    if (userId) {
      filter.userId = userId;
    }

    const reserves = await Reserve.find(filter)
      .populate('userId', 'fullname email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: reserves.length,
      reserves
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch reserves',
      error: error.message
    });
  }
};


exports.getReservesById = async (req, res) => {
  try {
    const { id } = req.params;

    const reserve = await Reserve.findById(id)
      .populate('userId', 'fullname email phone');

    if (!reserve) {
      return res.status(404).json({ message: 'Reserve not found' });
    }

    res.status(200).json({
      status: 'success',
      reserve
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch reserve',
      error: error.message
    });
  }
};


exports.getReservesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const reserves = await Reserve.find({ userId })
      .populate('userId', 'fullname email phone')
      .sort({ startDate: -1 });

    res.status(200).json({
      status: 'success',
      results: reserves.length,
      reserves
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user reserves',
      error: error.message
    });
  }
};


exports.createReserve = async (req, res) => {
  try {
    const { userId, startDate, endDate, totalPrice, AdvancePayment, time } = req.body;

    if (!userId || !startDate || !endDate || totalPrice === undefined || AdvancePayment === undefined || !time) {
      return res.status(400).json({
        message: 'userId, startDate, endDate, totalPrice, AdvancePayment, and time are required'
      });
    }

    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    if (!start || !end || end <= start) {
      return res.status(400).json({
        message: 'startDate and endDate must be valid and endDate must be after startDate'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const numericTotalPrice = Number(totalPrice);
    const numericAdvancePayment = Number(AdvancePayment);

    if (Number.isNaN(numericTotalPrice) || Number.isNaN(numericAdvancePayment)) {
      return res.status(400).json({
        message: 'totalPrice and AdvancePayment must be valid numbers'
      });
    }

    if (user.balance < numericAdvancePayment) {
      return res.status(400).json({
        message: 'Insufficient balance for this reserve'
      });
    }

    const newReserve = await Reserve.create({
      userId,
      startDate: start,
      endDate: end,
      totalPrice: numericTotalPrice,
      AdvancePayment: numericAdvancePayment,
      time
    });

    user.balance -= numericAdvancePayment;
    await user.save();

    res.status(201).json({
      message: 'Reserve created successfully',
      reserve: newReserve,
      remainingBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create reserve',
      error: error.message
    });
  }
};


exports.getAvailableSlots = async (req, res) => {
  try {
    const reserves = await Reserve.find({});

    const today = getStartOfDay(new Date());

    const days = [];

    for (let i = 0; i < 8; i += 1) {
      const dayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );

      const daySlots = buildDaySlots(dayDate).filter((slot) => {
        return !reserves.some((reserve) => {
          const reserveStart = normalizeDate(reserve.startDate);
          const reserveEnd = normalizeDate(reserve.endDate);

          if (!reserveStart || !reserveEnd) {
            return false;
          }

          return overlaps(slot.start, slot.end, reserveStart, reserveEnd);
        });
      });

      days.push({
        date: formatDateKey(dayDate),
        slots: daySlots.map((slot) => ({
          start: slot.startLabel,
          end: slot.endLabel,
          startTime: formatLocalDateTime(slot.start),
          endTime: formatLocalDateTime(slot.end)
        }))
      });
    }

    res.status(200).json({
      status: 'success',
      days
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
};