const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sport: {
        type: String,
        required: true,
        trim: true
    },
    venue: {
        type: String,
        required: true,
        trim: true
    },
    datetime: {
        type: Date,
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['PendingValidation', 'Scheduled', 'Registration Open', 'Completed', 'Cancelled'],
        default: 'PendingValidation'
    },
    tournamentYear: {
        type: Number,
        default: () => new Date().getFullYear()
    },
    stage: {
        type: String,
        trim: true
    },
    maxTeams: {
        type: Number,
        default: 0
    },
    registeredTeams: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);