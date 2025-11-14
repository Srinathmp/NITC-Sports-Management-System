const mongoose = require("mongoose");
const { Schema } = mongoose;

const accommodationSchema = new Schema(
  {
    hostel_name: { type: String, required: true, trim: true },
    room_number: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    occupied: { type: Number, default: 0, min: 0 },
    check_in_date: { type: Date },
    check_out_date: { type: Date },
    remarks: { type: String, trim: true }, // amenities
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);