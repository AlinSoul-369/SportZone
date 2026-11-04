const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    team1:{
        type: String,
        required: true,
        trim: true
    },
    team2:{
        type: String,
        required: true,
        trim: true
    },
    winner:{
        type: String,
        trim: true,
        default: null
    },
    status:{
        type: String,
        enum: ['upcoming', 'completed'],
        default: 'upcoming'
    }
    ,
    date:{
        type: Date,
        required: true
    },
    result:{
        type: String,
        trim: true,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);