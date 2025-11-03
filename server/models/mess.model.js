const mongoose = require("mongoose");
const { Schema } = mongoose;

const mealSchema = new Schema(
  {
    meal_type: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner"],
      required: true,
    },
    start_time: {
      type: String, // e.g., "07:30 AM"
      required: true,
    },
    end_time: {
      type: String, // e.g., "09:30 AM"
      required: true,
    },
    menu_items: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const messSchema = new Schema(
  {
    nit_id: {
      type: Schema.Types.ObjectId,
      ref: "NIT",
      required: true,
    },
    mess_name: {
      type: String,
      required: true,
      trim: true,
    },
    capacity_per_meal: {
      type: Number,
      required: true,
      min: 10,
    },
    location: {
      type: String,
      required: true,
    },
    meal_schedule: {
      type: [mealSchema],
      default: [],
    },
    allocated_teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mess", messSchema);