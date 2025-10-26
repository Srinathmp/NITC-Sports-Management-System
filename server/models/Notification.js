const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    user_id: { // The recipient, if it's a targeted notification
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_by: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }, // who triggered it
    recipientRole: { // Used for broadcasting to a role
        type: String,
        enum: ['All', 'CommonAdmin', 'NITAdmin', 'Coach'],
        default: 'All'
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Announcement', 'Result', 'ScheduleUpdate', 'Approval'],
        required: true,
        default: 'Announcement'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);