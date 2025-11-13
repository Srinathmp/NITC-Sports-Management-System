const Accommodation = require("../models/accommodation.model");
const Mess  =  require("../models/mess.model");
exports.getAllAccommodations = async (req, res) => {
  try {
    // No populate needed now
    const accommodations = await Accommodation.find().sort({ createdAt: -1 });

    res.status(200).json(accommodations);
  } catch (err) {
    console.error("Error fetching accommodations:", err.message);
    res.status(500).json({ error: "Failed to fetch accommodations" });
  }
};


exports.addAccommodation = async (req, res) => {
  try {
    const accommodation = new Accommodation(req.body);
    await accommodation.save();
    res.status(201).json(accommodation);
  } catch (err) {
    res.status(400).json({ error: "Error creating accommodation"+err });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(accommodation);
  } catch (err) {
    res.status(400).json({ error: "Error updating accommodation"});
  }
};

exports.getAccommodationSummary = async (req, res) => {
  try {
    // ACCOMMODATION TOTALS
    const accData = await Accommodation.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: "$capacity" },
          totalOccupied: { $sum: "$occupied" }
        }
      }
    ]);

    const accommodation = accData[0] || {
      totalCapacity: 0,
      totalOccupied: 0
    };

    // MESS TOTALS
    const messData = await Mess.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: "$capacity_per_meal" },
          totalOccupied: { $sum: "$occupied" }
        }
      }
    ]);

    const mess = messData[0] || {
      totalCapacity: 0,
      totalOccupied: 0
    };

    res.status(200).json({
      accommodation,
      mess
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({
      error: "Failed to fetch accommodation and mess summary"
    });
  }
};