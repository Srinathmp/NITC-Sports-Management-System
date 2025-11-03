const mongoose = require('mongoose');
const { Schema } = mongoose;

const nitSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    isHost: {
        type: Boolean,
        default: false
    },
    points:{
        type: Number,
        default:0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NIT', nitSchema);