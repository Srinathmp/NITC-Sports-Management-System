const mongoose = require('mongoose');
const { Schema } = mongoose;

const playerSchema = new Schema({
    name: { type: String, required: true },
    jerseyNo: { type: Number },
    position: { type: String }
}, { _id: false });

const teamSchema = new Schema({
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
    coach_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nit_id: {
        type: Schema.Types.ObjectId,
        ref: 'NIT',
        required: true
    },
    players: [playerSchema] 
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema); 