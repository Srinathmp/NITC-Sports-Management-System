const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema({
    action: {
        type: String,
        enum: ['Create', 'Update', 'Delete', 'Approve', 'Reject', 'Login','Publish'],
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entity: {
        type: String,
        required: true,
        trim: true
    },
    entity_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    details: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);