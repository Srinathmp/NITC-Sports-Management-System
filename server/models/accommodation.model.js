const mongoose = require("mongoose");
const { Schema } = mongoose;

const accommodationSchema = new Schema(
  {
    nit_id: {
      type: Schema.Types.ObjectId,
      ref: "NIT",
      required: true,
    },
    hostel_name: {
      type: String,
      required: true,
      trim: true,
    },
    room_number: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    occupied: {
      type: Number,
      default: 0,
      min: 0,
    },
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null, // null means unallocated
    },
    check_in_date: {
      type: Date,
    },
    check_out_date: {
      type: Date,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);