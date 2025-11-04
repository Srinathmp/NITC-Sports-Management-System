const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema({
    action: {
        type: String,
        enum: ['Create', 'Update', 'Delete', 'Approve', 'Reject', 'Login'],
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entity: { // The type of document that was changed
        type: String,
        required: true,
        trim: true
    },
    entity_id: { // The specific document ID
        type: Schema.Types.ObjectId,
        required: true
    },
    details: { // A short description of the change
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);