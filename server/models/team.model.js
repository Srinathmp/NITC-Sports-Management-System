const mongoose = require('mongoose');
const { Schema } = mongoose;

const playerSchema = new Schema({
  name:     { type: String, required: true },
  jerseyNo: { type: Number },        // numeric jersey number
  position: { type: String }
}, { _id: false });

const teamSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  sport:    { type: String, required: true, trim: true },
  coach_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nit_id:   { type: Schema.Types.ObjectId, ref: 'NIT',  required: true },
  players:  [playerSchema]
}, {
  timestamps: true
});

// One team per coach per NIT per sport (matches your assumption)
teamSchema.index({ coach_id: 1, nit_id: 1, sport: 1 }, { unique: true });

module.exports = mongoose.model('Team', teamSchema);
