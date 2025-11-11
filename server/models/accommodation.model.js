// models/accommodation.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const accommodationSchema = new Schema(
  {
    hostel_name: { type: String, required: true, trim: true },
    room_number: { type: String, required: true, trim: true }, // keep if you still display room info; otherwise you can remove
    capacity: { type: Number, required: true, min: 1 },
    occupied: { type: Number, default: 0, min: 0 },
    // team_id: REMOVE (bookings tracked in a separate collection)
    check_in_date: { type: Date },
    check_out_date: { type: Date },
    remarks: { type: String, trim: true }, // amenities
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);
