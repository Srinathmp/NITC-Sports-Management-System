const mongoose = require("mongoose");
const { Schema } = mongoose;

const messBookingSchema = new Schema(
  {
    mess_id:  { type: Schema.Types.ObjectId, ref: "Mess", required: true },
    coach_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    team_id:  { type: Schema.Types.ObjectId, ref: "Team", required: true },
    count:    { type: Number, required: true, min: 1 }, // people count
    status:   { type: String, enum: ["Booked", "Cancelled"], default: "Booked" },
    remarks:  { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessBooking", messBookingSchema);
