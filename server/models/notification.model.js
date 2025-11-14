const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    title: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipientRole: {
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