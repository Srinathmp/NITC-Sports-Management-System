const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchSchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    teamA_id: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    teamB_id: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    scoreA: { type: Number, default: 0 },
    scoreB: { type: Number, default: 0 },
    winner_id: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    remarks: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Ongoing', 'Completed'],
        default: 'Scheduled'
    },
    matchDateTime: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);