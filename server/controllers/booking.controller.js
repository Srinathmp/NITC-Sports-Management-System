const mongoose = require("mongoose");
const Accommodation = require("../models/accommodation.model");
const Mess = require("../models/mess.model");
const AccommodationBooking = require("../models/accommodationBooking.model");
const MessBooking = require("../models/messBooking.model");

// POST /api/bookings/accommodation
exports.bookAccommodation = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { accommodation_id, team_id, count, remarks } = req.body;
    const coach_id = req.user?._id;

    if (!accommodation_id || !team_id || !count) {
      return res.status(400).json({ error: "accommodation_id, team_id and count are required" });
    }

    await session.withTransaction(async () => {
      // 1) Atomically check capacity and increment occupied
      const updated = await Accommodation.findOneAndUpdate(
        {
          _id: accommodation_id,
          $expr: { $lte: [{ $add: ["$occupied", Number(count)] }, "$capacity"] },
        },
        { $inc: { occupied: Number(count) } },
        { new: true, session }
      );
      if (!updated) {
        throw new Error("Accommodation fully booked or insufficient capacity");
      }

      // 2) Create the booking
      await AccommodationBooking.create(
        [{ accommodation_id, coach_id, team_id, count: Number(count), remarks: remarks || "" }],
        { session }
      );
    });

    res.status(201).json({ message: "Accommodation booked successfully" });
  } catch (err) {
    console.error("Accommodation booking error:", err.message);
    res.status(400).json({ error: err.message || "Failed to book accommodation" });
  } finally {
    session.endSession();
  }
};

// GET /api/bookings/accommodation/my
exports.myAccommodationBookings = async (req, res) => {
  try {
    const coach_id = req.user?._id;
    const data = await AccommodationBooking.find({ coach_id })
      .populate("accommodation_id", "hostel_name capacity occupied remarks")
      .populate("team_id", "name");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your accommodation bookings" });
  }
};

// POST /api/bookings/mess
exports.bookMess = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { mess_id, team_id, count, remarks } = req.body;
    const coach_id = req.user?._id;

    if (!mess_id || !team_id || !count) {
      return res.status(400).json({ error: "mess_id, team_id and count are required" });
    }

    await session.withTransaction(async () => {
      // 1) Atomically check capacity_per_meal and increment occupied
      const updated = await Mess.findOneAndUpdate(
        {
          _id: mess_id,
          $expr: { $lte: [{ $add: ["$occupied", Number(count)] }, "$capacity_per_meal"] },
        },
        { $inc: { occupied: Number(count) } },
        { new: true, session }
      );
      if (!updated) {
        throw new Error("Mess fully booked for meal or insufficient capacity");
      }

      // 2) Create the booking
      await MessBooking.create(
        [{ mess_id, coach_id, team_id, count: Number(count), remarks: remarks || "" }],
        { session }
      );
    });

    res.status(201).json({ message: "Mess booked successfully" });
  } catch (err) {
    console.error("Mess booking error:", err.message);
    res.status(400).json({ error: err.message || "Failed to book mess" });
  } finally {
    session.endSession();
  }
};

// GET /api/bookings/mess/my
exports.myMessBookings = async (req, res) => {
  try {
    const coach_id = req.user?._id;
    const data = await MessBooking.find({ coach_id })
      .populate("mess_id", "mess_name capacity_per_meal occupied location remarks")
      .populate("team_id", "name");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your mess bookings" });
  }
};
