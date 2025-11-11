const mongoose = require("mongoose");
const { Schema } = mongoose;

const accommodationBookingSchema = new Schema(
  {
    accommodation_id: { type: Schema.Types.ObjectId, ref: "Accommodation", required: true },
    coach_id:         { type: Schema.Types.ObjectId, ref: "User", required: true },
    team_id:          { type: Schema.Types.ObjectId, ref: "Team", required: true }, // one team per coach
    count:            { type: Number, required: true, min: 1 }, // people count
    status:           { type: String, enum: ["Booked", "Cancelled"], default: "Booked" },
    remarks:          { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccommodationBooking", accommodationBookingSchema);
